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
  const { currentPosition, getCurrentLocation } = useOutletContext<ContextType>();
  const { startWalking, endWalking, totalDistance, isWalking } = useWalking();

  const [center, setCenter] = useState<LatLng>(currentPosition);
  const [mapLevel, setMapLevel] = useState(3);
  const [walkingPath, setWalkingPath] = useState<LatLng[]>([]);
  const [userPosition, setUserPosition] = useState<LatLng>(currentPosition);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDogs, setSelectedDogs] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showWalkingStatus, setShowWalkingStatus] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [walkSeconds, setWalkSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    setCenter(currentPosition);
  }, [currentPosition]);

  const handleDogSelect = (dogId: number) => {
    setSelectedDogs((prev) => (prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]));
  };

  // 실시간 위치 추적 설정
  useEffect(() => {
    if (!isWalking) return;

    let watchId: number;

    const startWatchingPosition = () => {
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported');
        return;
      }

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setUserPosition(newPosition);
          setCenter(newPosition);
          setWalkingPath((prev) => [...prev, newPosition]);
        },
        (error) => {
          console.error('Error watching position:', error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 5000,
        },
      );
    };

    startWatchingPosition();

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isWalking]);

  useEffect(() => {
    if (isWalking) {
      setCenter(userPosition);
    }
  }, [userPosition, isWalking]);

  const handleStartWalkClick = () => {
    setIsModalOpen(false);
    setShowCountdown(true);
  };

  const handleCountdownComplete = useCallback(async () => {
    try {
      setIsLoading(true);
      const success = await startWalking(selectedDogs);
      if (success) {
        setWalkingPath([currentPosition]);
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
  }, [startWalking, selectedDogs, currentPosition]);

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
        <MapMarker position={userPosition} image={PRESENT_SPOT_IMAGE} />
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
