import { useState, useEffect, useCallback, useRef } from 'react';
import { useOutletContext, useLocation, useNavigate, useNavigationType } from 'react-router-dom';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import WalkStartModal from '@/components/map/WalkStartModal';
import WalkingStatusModal from '@/components/map/WalkingStatusModal';
import type { LatLng } from '@/types/map';
import CountdownOverlay from '@/components/map/CountdownOverlay';
import WalkEndModal from '@/components/map/WalkEndModal';
import WalkCompleteModal from '@/components/map/WalkCompleteModal';

type ContextType = {
  currentPosition: LatLng;
  currentLocation: string;
  getCurrentLocation: () => void;
};

const PRESENT_SPOT_IMAGE = {
  src: '/icons/PresentSpot.svg',
  size: {
    width: 70,
    height: 70,
  },
};

const WalkingMap = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentPosition, getCurrentLocation } = useOutletContext<ContextType>();

  const [center, setCenter] = useState<LatLng>(currentPosition);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDogs, setSelectedDogs] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showWalkingStatus, setShowWalkingStatus] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [walkSeconds, setWalkSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [nextLocation, setNextLocation] = useState<string | null>(null);
  const [attemptedPath, setAttemptedPath] = useState<string | null>(null);
  const prevLocationRef = useRef(location);

  // 선택된 강아지 목록 (임시 데이터)
  const dogList = [
    { id: 1, name: '뽀삐', age: 3 },
    { id: 2, name: '쿠키', age: 5 },
    { id: 3, name: '몽이', age: 2 },
    { id: 4, name: '초코', age: 4 },
    { id: 5, name: '루비', age: 1 },
    { id: 6, name: '우유', age: 4 },
    { id: 7, name: '다이아', age: 1 },
  ];

  // 브라우저 뒤로가기/새로고침 방지
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (showWalkingStatus) {
        e.preventDefault();
        const message = '산책이 진행 중입니다. 페이지를 떠나시겠습니까?';
        e.returnValue = message;
        return message;
      }
    };

    if (showWalkingStatus) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [showWalkingStatus]);

// 산책 시작/종료 시 상태 저장
useEffect(() => {
  if (showWalkingStatus) {
    sessionStorage.setItem('walkInProgress', 'true');
  } else {
    sessionStorage.removeItem('walkInProgress');
  }
}, [showWalkingStatus]);

// 페이지 전환 감지
useEffect(() => {
  if (
    showWalkingStatus &&
    !isEndModalOpen &&
    !isCompleteModalOpen &&
    location.pathname !== prevLocationRef.current.pathname
  ) {
    // 이동 시도한 경로 저장
    setAttemptedPath(location.pathname);
    // 이동 시도 감지됨
    setIsEndModalOpen(true);
    setIsPaused(true);
    // 이전 경로로 강제 이동
    navigate(prevLocationRef.current.pathname, { replace: true });
  } else {
    prevLocationRef.current = location;
  }
}, [location, showWalkingStatus, isEndModalOpen, isCompleteModalOpen, navigate]);

// 뒤로가기 이벤트 추가
useEffect(() => {
  const handleNavigation = () => {
    const isWalking = sessionStorage.getItem('walkInProgress') === 'true';
    if (isWalking && !isEndModalOpen && !isCompleteModalOpen) {
      setAttemptedPath(window.location.pathname);
      setIsEndModalOpen(true);
      setIsPaused(true);
      navigate(prevLocationRef.current.pathname, { replace: true });
    }
  };

  window.addEventListener('popstate', handleNavigation);
  return () => window.removeEventListener('popstate', handleNavigation);
}, [showWalkingStatus, isEndModalOpen, isCompleteModalOpen, navigate]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(newPosition);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        },
      );
    }
  }, []);

  useEffect(() => {
    setCenter(currentPosition);
  }, [currentPosition]);

  const handleDogSelect = (dogId: number) => {
    setSelectedDogs((prev) => (prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]));
  };

  const handleStartWalk = () => {
    setIsModalOpen(false);
    setShowCountdown(true);
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setShowWalkingStatus(true);
  };

  const handleStopWalk = () => {
    setIsEndModalOpen(true);
    setIsPaused(true);
  };

  const handleEndModalClose = () => {
    setIsEndModalOpen(false);
    setIsPaused(false);
    setAttemptedPath(null);
  };

  const handleWalkEnd = useCallback(() => {
    setIsEndModalOpen(false);
    setShowWalkingStatus(false);
    setIsCompleteModalOpen(true);

    // 저장된 다음 경로가 있으면 해당 경로로 이동
    if (attemptedPath) {
      navigate(attemptedPath);
      setAttemptedPath(null);
    }
  }, [attemptedPath, navigate]);

  const handleCompleteModalClose = () => {
    setIsCompleteModalOpen(false);
  };

  const selectedDogNames = selectedDogs
    .map((id) => {
      const dog = dogList.find((d) => d.id === id);
      return dog ? dog.name : '';
    })
    .filter((name) => name !== '');

  return (
    <div className="relative w-full h-full">
      <Map center={center} style={{ width: '100%', height: '100%' }} level={3} zoomable={true}>
        <MapMarker position={center} image={PRESENT_SPOT_IMAGE} />
      </Map>

      <WalkStartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDogs={selectedDogs}
        onDogSelect={handleDogSelect}
        onStartWalk={handleStartWalk}
      />

      {showCountdown && <CountdownOverlay onComplete={handleCountdownComplete} />}

      <WalkingStatusModal
        isOpen={showWalkingStatus}
        onClose={() => setShowWalkingStatus(false)}
        dogNames={selectedDogNames}
        onStopWalk={handleStopWalk}
        walkSeconds={walkSeconds}
        setWalkSeconds={setWalkSeconds}
        isPaused={isPaused}
      />

      <WalkEndModal isOpen={isEndModalOpen} onClose={handleEndModalClose} onConfirm={handleWalkEnd} />

      <WalkCompleteModal isOpen={isCompleteModalOpen} onClose={handleCompleteModalClose} />

      {isLoading && <LoadingOverlay message="위치를 불러오는 중..." />}
    </div>
  );
};

export default WalkingMap;
