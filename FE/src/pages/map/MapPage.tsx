import { useState, useCallback, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MdNotifications } from 'react-icons/md';
import { RiFocus3Line } from 'react-icons/ri';
import { TopBar } from '@/components/map/TopBar';
import { Toast } from '@/components/common/Message/Toast';
import type { LatLng } from '@/types/map';

const MapPage = () => {
  const location = useLocation();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [currentPosition, setCurrentPosition] = useState<LatLng>({
    lat: 36.0970625,
    lng: 128.4019375,
  });
  const [isTracking, setIsTracking] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isWalkingMode, setIsWalkingMode] = useState(location.pathname === '/walking');
  const navigate = useNavigate();

  // 페이지 변경 감지 및 토스트 메시지 표시
  useEffect(() => {
    setIsWalkingMode(location.pathname === '/walking');
    setShowToast(true);
  }, [location.pathname]);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({
            lat: latitude,
            lng: longitude,
          });

          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.coord2Address(longitude, latitude, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK && result[0]) {
              const address = result[0].address;
              setCurrentLocation(address.address_name);
            }
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setCurrentLocation('위치를 가져올 수 없습니다');
        },
      );
    }
  }, []);

  useEffect(() => {
    let watchId: number;

    if (isTracking && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({
            lat: latitude,
            lng: longitude,
          });

          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.coord2Address(longitude, latitude, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK && result[0]) {
              const address = result[0].address;
              setCurrentLocation(address.address_name);
            }
          });
        },
        (error) => {
          console.error('Error tracking location:', error);
          setIsTracking(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isTracking]);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const handleModeChange = (mode: boolean) => {
    setIsWalkingMode(mode);
    navigate(mode ? '/walking' : '/meeting');
  };

  const getToastMessage = () => {
    return location.pathname === '/walking' ? '산책하기 지도입니다!' : '모임찾기 지도입니다!';
  };

  const handleTrackingToggle = () => {
    const newTrackingState = !isTracking;
    setIsTracking(newTrackingState);
    if (newTrackingState) {
      getCurrentLocation(); // 추적 시작 시 즉시 현재 위치 갱신
    }
  };

  return (
    <div className="w-full h-screen flex flex-col relative">
      <Toast message={getToastMessage()} isVisible={showToast} onHide={() => setShowToast(false)} />

      <TopBar
        isWalkingMode={isWalkingMode}
        searchKeyword={searchKeyword}
        currentLocation={currentLocation}
        onSearchChange={setSearchKeyword}
        onModeChange={handleModeChange}
      />

      {/* 우측 상단 아이콘들 */}
      <div className="absolute top-20 right-4 z-50">
        <div className="flex flex-col gap-2">
          <button className="bg-white p-3 rounded-full shadow-md">
            <MdNotifications className="text-2xl text-gray-600" />
          </button>
          <button
            className={`bg-white p-3 rounded-full shadow-md ${isTracking ? 'text-blue-500' : 'text-gray-600'}`}
            onClick={handleTrackingToggle}
          >
            <RiFocus3Line className="text-2xl" />
          </button>
        </div>
      </div>

      <div className="flex-1">
        <Outlet
          context={{
            searchKeyword,
            currentLocation,
            currentPosition,
            getCurrentLocation,
            isTracking,
          }}
        />
      </div>
    </div>
  );
};

export default MapPage;
