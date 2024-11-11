// WalkingMap.tsx
import { useState, useEffect, useCallback } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Map, MapMarker, Polyline } from 'react-kakao-maps-sdk';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import WalkStartModal from '@/components/map/WalkStartModal';
import WalkingStatusModal from '@/components/map/WalkingStatusModal';
import CountdownOverlay from '@/components/map/CountdownOverlay';
import WalkEndModal from '@/components/map/WalkEndModal';
import WalkCompleteModal from '@/components/map/WalkCompleteModal';
import { useWalking } from '@/hooks/map/useWalking';
import type { LatLng } from '@/types/map';

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
  const navigate = useNavigate();
  const { currentPosition: contextPosition } = useOutletContext<ContextType>();
  const { startWalking, endWalking, totalDistance, isWalking, currentPosition, walkingPath } = useWalking();

  const [center, setCenter] = useState<LatLng>(contextPosition);
  const [mapLevel, setMapLevel] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDogs, setSelectedDogs] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showWalkingStatus, setShowWalkingStatus] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [walkSeconds, setWalkSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 지도 중앙 위치 자동 조정
  useEffect(() => {
    if (isWalking && currentPosition) {
      setCenter(currentPosition);
    } else {
      setCenter(contextPosition);
    }
  }, [currentPosition, contextPosition, isWalking]);

  const handleDogSelect = (dogId: number) => {
    setSelectedDogs((prev) => (prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]));
  };

  const handleStartWalkClick = () => {
    setIsModalOpen(false);
    setShowCountdown(true);
  };

  const handleCountdownComplete = useCallback(async () => {
    try {
      setIsLoading(true);
      const success = await startWalking(selectedDogs);
      if (success) {
        setShowCountdown(false);
        setShowWalkingStatus(true);
      }
    } catch (error) {
      console.error('Failed to start walking:', error);
      setIsModalOpen(true);
      setShowCountdown(false);
    } finally {
      setIsLoading(false);
    }
  }, [startWalking, selectedDogs]);

  const handleStopWalk = () => {
    setIsEndModalOpen(true);
    setIsPaused(true);
  };

  const handleEndModalClose = () => {
    setIsEndModalOpen(false);
    setIsPaused(false);
  };

  const handleWalkEnd = useCallback(async () => {
    try {
      const success = await endWalking();
      if (success) {
        setIsEndModalOpen(false);
        setShowWalkingStatus(false);
        setIsCompleteModalOpen(true);
      }
    } catch (error) {
      console.error('Failed to end walking:', error);
    }
  }, [endWalking]);

  const handleCompleteModalClose = () => {
    setIsCompleteModalOpen(false);
    setWalkSeconds(0);
    setSelectedDogs([]);
    navigate('/');
  };

  return (
    <div className="relative w-full h-full">
      <Map center={center} style={{ width: '100%', height: '100%' }} level={mapLevel} zoomable={true}>
        <MapMarker position={currentPosition || contextPosition} image={PRESENT_SPOT_IMAGE} />
        {isWalking && walkingPath.length > 1 && (
          <Polyline path={walkingPath} strokeWeight={5} strokeColor="#FF5A5F" strokeOpacity={0.7} strokeStyle="solid" />
        )}
      </Map>

      <WalkStartModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDogs={selectedDogs}
        onDogSelect={handleDogSelect}
        onStartWalk={handleStartWalkClick}
      />

      {showCountdown && <CountdownOverlay onComplete={handleCountdownComplete} />}

      <WalkingStatusModal
        isOpen={showWalkingStatus}
        onClose={() => setShowWalkingStatus(false)}
        selectedDogs={selectedDogs}
        onStopWalk={handleStopWalk}
        walkSeconds={walkSeconds}
        setWalkSeconds={setWalkSeconds}
        isPaused={isPaused}
        distance={totalDistance}
      />

      <WalkEndModal isOpen={isEndModalOpen} onClose={handleEndModalClose} onConfirm={handleWalkEnd} />

      <WalkCompleteModal isOpen={isCompleteModalOpen} onClose={handleCompleteModalClose} />

      {isLoading && <LoadingOverlay message="잠시만 기다려주세요..." />}
    </div>
  );
};

export default WalkingMap;