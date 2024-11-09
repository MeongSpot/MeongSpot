import { useState, useCallback, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MdNotifications } from 'react-icons/md';
import { RiFocus3Line } from 'react-icons/ri';
import { TopBar } from '@/components/map/TopBar';
import type { LatLng } from '@/types/map';

const MapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [currentPosition, setCurrentPosition] = useState<LatLng>({ lat: 36.0970625, lng: 128.4019375 });
  const [isTracking, setIsTracking] = useState(false);
  const [isWalkingMode, setIsWalkingMode] = useState(location.pathname === '/walking');
  const [searchResult, setSearchResult] = useState<LatLng | null>(null);

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2Address(longitude, latitude, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK && result[0]) {
            setCurrentLocation(result[0].address.address_name);
          }
        });
      },
      () => setCurrentLocation('위치를 가져올 수 없습니다'),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    if (!isTracking || !navigator.geolocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });

        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.coord2Address(longitude, latitude, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK && result[0]) {
            setCurrentLocation(result[0].address.address_name);
          }
        });
      },
      () => setIsTracking(false),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isTracking]);

  const handleSearch = useCallback(() => {
    if (!searchKeyword.trim()) return;
  
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchKeyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK && data[0]) {
        setSearchResult({
          lat: parseFloat(data[0].y),
          lng: parseFloat(data[0].x),
        });
        
        // 검색 결과를 설정한 후 일정 시간 후에 초기화
        setTimeout(() => {
          setSearchResult(null);
        }, 10); // 지도 이동이 완료되고 나서 초기화
      }
    });
  }, [searchKeyword]);

  const handleModeChange = useCallback(
    (mode: boolean) => {
      setIsWalkingMode(mode);
      navigate(mode ? '/walking' : '/meeting');
    },
    [navigate],
  );

  const handleTrackingToggle = useCallback(() => {
    const newTrackingState = !isTracking;
    setIsTracking(newTrackingState);
    if (newTrackingState) {
      getCurrentLocation();
    }
  }, [isTracking, getCurrentLocation]);

  return (
    <div className="w-full h-screen flex flex-col relative">
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
            onMapMove: () => isTracking && setIsTracking(false),
            searchResult,
            onSearch: handleSearch,
          }}
        />
      </div>
    </div>
  );
};

export default MapPage;
