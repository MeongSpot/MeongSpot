import { useState, useCallback, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MdNotifications, MdSearch } from 'react-icons/md';
import { RiFocus3Line } from 'react-icons/ri';
import { TopBar } from '@/components/map/TopBar';
import type { LatLng } from '@/types/map';

const MapPage = () => {
  const location = useLocation();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [currentPosition, setCurrentPosition] = useState<LatLng | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isWalkingMode, setIsWalkingMode] = useState(location.pathname === '/walking');
  const [searchResult, setSearchResult] = useState<LatLng | null>(null); // 검색 결과 좌표 추가
  const navigate = useNavigate();

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPosition = { lat: latitude, lng: longitude };
          setCurrentPosition(newPosition);

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
          setCurrentPosition({ lat: 36.0970625, lng: 128.4019375 });
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    }
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    let watchId: number;
    if (isTracking && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPosition = { lat: latitude, lng: longitude };
          setCurrentPosition(newPosition);

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
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isTracking]);

  const handleModeChange = (mode: boolean) => {
    setIsWalkingMode(mode);
    navigate(mode ? '/walking' : '/meeting');
  };

  const handleTrackingToggle = () => {
    const newTrackingState = !isTracking;
    setIsTracking(newTrackingState);
    if (newTrackingState) {
      getCurrentLocation();
    }
  };

  const handleSearch = useCallback(() => {
    if (!searchKeyword.trim()) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchKeyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK && data[0]) {
        // 검색 결과 좌표 설정
        setSearchResult({
          lat: parseFloat(data[0].y),
          lng: parseFloat(data[0].x),
        });
      }
    });
  }, [searchKeyword]);

  const handleMapMove = () => {
    if (isTracking) {
      setIsTracking(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col relative">
      {currentPosition ? (
        <>
          <TopBar
            isWalkingMode={isWalkingMode}
            searchKeyword={searchKeyword}
            currentLocation={currentLocation}
            onSearchChange={setSearchKeyword}
            onModeChange={handleModeChange}
            onSearch={handleSearch}
          />

          <div className="absolute top-20 right-4 z-50">
            <div className="flex flex-col gap-2">
              <button className="bg-white p-3 rounded-full shadow-md">
                <MdNotifications className="text-2xl text-gray-600" />
              </button>
              <button
                className={`p-3 rounded-full shadow-md ${
                  isTracking
                    ? isWalkingMode
                      ? 'text-white bg-deep-coral'
                      : 'text-white bg-light-orange'
                    : 'bg-white text-gray-600'
                }`}
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
                isTracking,
                onMapMove: handleMapMove,
                searchResult, // 검색 결과 좌표 전달
                onSearch: handleSearch,
              }}
            />
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-lg">위치를 가져오는 중...</div>
        </div>
      )}
    </div>
  );
};

export default MapPage;
