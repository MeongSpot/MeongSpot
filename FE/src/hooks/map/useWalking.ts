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
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [pathCoordinates, setPathCoordinates] = useState<LatLng[]>([]);
  const lastKnownPosition = useRef<LatLng | null>(null);
  const loginId = useAuthStore((state) => state.loginId);

  const showMessage = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
  }, []);

  const hideMessage = useCallback(() => {
    setShowToast(false);
  }, []);

  const updateDistance = useCallback((newPosition: LatLng) => {
    if (!lastKnownPosition.current) {
      lastKnownPosition.current = newPosition;
      return;
    }

    const newDistance = walkingService.calculateDistance(lastKnownPosition.current, newPosition);
    if (newDistance >= 2) {
      // 최소 2미터 이상 이동했을 때만 업데이트
      setTotalDistance((prev) => prev + newDistance);
      lastKnownPosition.current = newPosition;
    }
  }, []);

  const watchLocation = useCallback(() => {
    if (!navigator.geolocation || !loginId) {
      setError('위치 정보가 지원되지 않는 브라우저입니다');
      return;
    }

    const errorMessages: Record<number, string> = {
      1: '위치 정보 접근 권한이 거부되었습니다',
      2: '위치 정보를 사용할 수 없습니다',
      3: '위치 정보 요청이 시간 초과되었습니다',
    };

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setCurrentPosition(newPosition);
        setPathCoordinates((prev) => [...prev, newPosition]);
        updateDistance(newPosition);

        const locationData: WalkingLocationPayload = {
          loginId,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        walkingService.sendLocation(locationData);
      },
      (error) => {
        const errorMessage = errorMessages[error.code] ?? '위치 정보를 가져오는데 실패했습니다';
        setError(errorMessage);
        showMessage(errorMessage);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 },
    );

    setWatchId(id);
  }, [loginId, updateDistance, showMessage]);

  const startWalking = useCallback(
    async (dogIds: number[]) => {
      try {
        if (!loginId) throw new Error('사용자 정보를 찾을 수 없습니다');

        const response = await walkingService.startWalking(dogIds);
        if (response.code === WALKING_API_CODE.START_SUCCESS) {
          setTotalDistance(0);
          setPathCoordinates([]);
          lastKnownPosition.current = null;

          const newSocket = walkingService.connectWebSocket(() => {
            showMessage('산책 서버 연결에 실패했습니다');
            setError('WebSocket connection error');
          });

          setSocket(newSocket);
          setIsWalking(true);
          watchLocation();
          showMessage('산책이 시작되었습니다');
          return true;
        }
        throw new Error(response.message);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '산책을 시작할 수 없습니다';
        setError(errorMessage);
        showMessage(errorMessage);
        throw err;
      }
    },
    [loginId, watchLocation, showMessage],
  );

  const stopWalking = useCallback(() => {
    if (socket) {
      walkingService.disconnect();
      setSocket(null);
    }
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsWalking(false);
    setTotalDistance(0);
    setPathCoordinates([]);
    lastKnownPosition.current = null;
  }, [socket, watchId]);

  const endWalking = useCallback(async () => {
    try {
      const response = await walkingService.endWalking(totalDistance);
      if (response.code === WALKING_API_CODE.END_SUCCESS) {
        stopWalking();
        showMessage('산책이 종료되었습니다');
        return true;
      }
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '산책을 종료할 수 없습니다';
      setError(errorMessage);
      showMessage(errorMessage);
      return false;
    }
  }, [stopWalking, showMessage, totalDistance]);

  useEffect(() => {
    return () => {
      if (socket) walkingService.disconnect();
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, watchId]);

  return {
    isWalking,
    error,
    startWalking,
    stopWalking,
    endWalking,
    totalDistance,
    currentPosition,
    pathCoordinates,
    toast: {
      message: toastMessage,
      isVisible: showToast,
      onHide: hideMessage,
    },
  };
};
