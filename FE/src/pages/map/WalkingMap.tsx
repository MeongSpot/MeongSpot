import { useState, useEffect } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useOutletContext } from 'react-router-dom';
import LoadingOverlay from '@/components/common/LoadingOverlay'; // LoadingOverlay 컴포넌트 불러오기
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

  return (
    <div className="relative w-full h-full">
      <Map center={center} style={{ width: '100%', height: '100%' }} level={3} zoomable={true}>
        <MapMarker position={center} image={PRESENT_SPOT_IMAGE} />
      </Map>

      {/* 로딩 중일 때만 LoadingOverlay 표시 */}
      {isLoading && <LoadingOverlay message="위치를 불러오는 중..." />}
    </div>
  );
};

export default WalkingMap;
