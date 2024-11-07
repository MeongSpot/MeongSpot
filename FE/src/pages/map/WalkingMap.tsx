import { useState, useEffect } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useOutletContext } from 'react-router-dom';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import WalkStartModal from '@/components/map/WalkStartModal';
import type { LatLng } from '../../types/map';

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
  const { currentPosition, getCurrentLocation } = useOutletContext<ContextType>();
  const [center, setCenter] = useState<LatLng>(currentPosition);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDogs, setSelectedDogs] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(true);

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
    // 산책 시작 로직 추가
  };

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

      {isLoading && <LoadingOverlay message="위치를 불러오는 중..." />}
    </div>
  );
};

export default WalkingMap;
