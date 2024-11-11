import { useState, useCallback, useEffect, useRef } from 'react';
import { walkingService } from '@/services/walkingService';
import { WalkingLocationPayload, WALKING_API_CODE } from '@/types/walking';
import useAuthStore from '@/store/useAuthStore';
import type { LatLng } from '@/types/map';

interface ToastState {
  message: string;
  isVisible: boolean;
  onHide: () => void;
}

export const useWalking = () => {
  const [isWalking, setIsWalking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [lastSentTime, setLastSentTime] = useState(0);
  const [walkingPath, setWalkingPath] = useState<LatLng[]>([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const loginId = useAuthStore((state) => state.loginId);

  const THROTTLE_DELAY = 5000; // 5초마다 위치 전송
  const MIN_DISTANCE = 2; // 최소 2미터 이상 이동했을 때만 거리 계산

  // 거리 계산 함수
  const calculateDistance = (point1: LatLng, point2: LatLng): number => {
    const R = 6371e3; // 지구의 반경 (미터)
    const φ1 = (point1.lat * Math.PI) / 180;
    const φ2 = (point2.lat * Math.PI) / 180;
    const Δφ = ((point2.lat - point1.lat) * Math.PI) / 180;
    const Δλ = ((point2.lng - point1.lng) * Math.PI) / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const showMessage = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
  }, []);

  const hideMessage = useCallback(() => {
    setShowToast(false);
  }, []);

  const updateDistance = useCallback((newPosition: LatLng) => {
    setWalkingPath((prevPath) => {
      if (prevPath.length === 0) return [newPosition];

      const lastPosition = prevPath[prevPath.length - 1];
      const distance = calculateDistance(lastPosition, newPosition);

      if (distance >= MIN_DISTANCE) {
        const newPath = [...prevPath, newPosition];
        setTotalDistance((prevDistance) => prevDistance + distance);
        return newPath;
      }

      return prevPath;
    });
    setCurrentPosition(newPosition);
  }, []);

  const clearWatchPosition = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  const sendLocationThrottled = useCallback(
    (locationData: WalkingLocationPayload) => {
      const now = Date.now();
      if (now - lastSentTime >= THROTTLE_DELAY) {
        walkingService.sendLocation(locationData);
        setLastSentTime(now);
      }
    },
    [lastSentTime],
  );

  const watchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('위치 정보가 지원되지 않는 브라우저입니다');
      return;
    }

    if (!loginId) {
      setError('사용자 정보를 찾을 수 없습니다');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        updateDistance(newPosition);

        const locationData: WalkingLocationPayload = {
          loginId,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        sendLocationThrottled(locationData);
      },
      (error) => {
        let errorMessage = '위치 정보를 가져오는데 실패했습니다';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '위치 정보 접근 권한이 거부되었습니다';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '위치 정보를 사용할 수 없습니다';
            break;
          case error.TIMEOUT:
            errorMessage = '위치 정보 요청이 시간 초과되었습니다';
            break;
        }
        setError(errorMessage);
        showMessage(errorMessage);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      },
    );

    setWatchId(id);
  }, [loginId, sendLocationThrottled, showMessage, updateDistance]);

  const startWalking = useCallback(
    async (dogIds: number[]) => {
      try {
        if (!loginId) {
          throw new Error('사용자 정보를 찾을 수 없습니다');
        }

        const response = await walkingService.startWalking(dogIds);
        // WK100도 성공 코드로 처리
        if (response.code === WALKING_API_CODE.START_SUCCESS) {
          setWalkingPath([]);
          setTotalDistance(0);

          const newSocket = walkingService.connectWebSocket(() => {
            showMessage('산책 서버 연결에 실패했습니다');
            setError('WebSocket connection error');
          });

          setSocket(newSocket);
          setIsWalking(true);
          watchLocation();
          showMessage('산책이 시작되었습니다');
          return true; // 성공 시 true 반환
        } else {
          throw new Error(response.message);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '산책을 시작할 수 없습니다';
        setError(errorMessage);
        showMessage(errorMessage);
        throw err;
      }
    },
    [watchLocation, loginId, showMessage],
  );

  const stopWalking = useCallback(() => {
    if (socket) {
      walkingService.disconnect();
      setSocket(null);
    }
    clearWatchPosition();
    setIsWalking(false);
    setWalkingPath([]);
    setTotalDistance(0);
  }, [socket, clearWatchPosition]);

  const endWalking = useCallback(async () => {
    try {
      const response = await walkingService.endWalking();
      if (response.code === WALKING_API_CODE.END_SUCCESS) {
        stopWalking();
        showMessage('산책이 종료되었습니다');
        return true;
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '산책을 종료할 수 없습니다';
      setError(errorMessage);
      showMessage(errorMessage);
      return false;
    }
  }, [stopWalking, showMessage]);

  useEffect(() => {
    return () => {
      if (socket) {
        walkingService.disconnect();
      }
      clearWatchPosition();
    };
  }, [socket, clearWatchPosition]);

  return {
    isWalking,
    error,
    startWalking,
    stopWalking,
    endWalking,
    totalDistance,
    currentPosition,
    walkingPath,
    toast: {
      message: toastMessage,
      isVisible: showToast,
      onHide: hideMessage,
    } as ToastState,
  };
};
