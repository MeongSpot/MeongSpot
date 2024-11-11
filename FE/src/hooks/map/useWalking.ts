// hooks/map/useWalking.ts
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
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const lastPositionRef = useRef<LatLng | null>(null);
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

  const shouldSendLocation = useCallback(
    (newPosition: LatLng): boolean => {
      const now = Date.now();
      const timeElapsed = now - lastSentTime;

      // 5초가 지나지 않았다면 전송하지 않음
      if (timeElapsed < THROTTLE_DELAY) {
        return false;
      }

      // 마지막 위치가 없다면 첫 전송이므로 true
      if (!lastPositionRef.current) {
        return true;
      }

      // 마지막 위치와의 거리 계산
      const distance = calculateDistance(lastPositionRef.current, newPosition);

      // 2미터 이상 이동했을 때만 전송
      return distance >= MIN_DISTANCE;
    },
    [lastSentTime],
  );

  const sendLocation = useCallback((locationData: WalkingLocationPayload) => {
    walkingService.sendLocation(locationData);
    setLastSentTime(Date.now());
    lastPositionRef.current = { lat: locationData.lat, lng: locationData.lng };

    // 거리 계산 및 업데이트
    if (lastPositionRef.current) {
      const distance = calculateDistance(lastPositionRef.current, { lat: locationData.lat, lng: locationData.lng });
      setTotalDistance((prev) => prev + distance);
    }
  }, []);

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

        setCurrentPosition(newPosition);

        if (shouldSendLocation(newPosition)) {
          const locationData: WalkingLocationPayload = {
            loginId,
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          sendLocation(locationData);
        }
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
  }, [loginId, sendLocation, shouldSendLocation, showMessage]);

  const clearWatchPosition = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  const startWalking = useCallback(
    async (dogIds: number[]) => {
      try {
        if (!loginId) {
          throw new Error('사용자 정보를 찾을 수 없습니다');
        }

        const response = await walkingService.startWalking(dogIds);
        if (response.code === WALKING_API_CODE.START_SUCCESS) {
          setTotalDistance(0);
          lastPositionRef.current = null;
          setLastSentTime(0);

          const newSocket = walkingService.connectWebSocket(() => {
            showMessage('산책 서버 연결에 실패했습니다');
            setError('WebSocket connection error');
          });

          setSocket(newSocket);
          setIsWalking(true);
          watchLocation();
          showMessage('산책이 시작되었습니다');
          return true;
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
    setTotalDistance(0);
    lastPositionRef.current = null;
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
    toast: {
      message: toastMessage,
      isVisible: showToast,
      onHide: hideMessage,
    } as ToastState,
  };
};
