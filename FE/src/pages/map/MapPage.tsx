import { useState, useCallback, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { MdNotifications } from 'react-icons/md';
import { RiFocus3Line, RiCompass3Line } from 'react-icons/ri';
import { TopBar } from '@/components/map/TopBar';
import type { LatLng } from '@/types/map';

interface DeviceOrientationEventiOS extends DeviceOrientationEvent {
  webkitCompassHeading?: number;
}

const MapPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentLocation, setCurrentLocation] = useState('');
  const [currentPosition, setCurrentPosition] = useState<LatLng>({ lat: 36.0970625, lng: 128.4019375 });
  const [isTracking, setIsTracking] = useState(false);
  const [isCompassMode, setIsCompassMode] = useState(false);
  const [heading, setHeading] = useState<number | null>(null);
  const [isWalkingMode, setIsWalkingMode] = useState(location.pathname === '/walking');
  const [searchResult, setSearchResult] = useState<LatLng | null>(null);

  // 모바일 디바이스 체크
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // 현재 위치 가져오기
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

  // 위치 추적 시작
  const startTracking = useCallback(() => {
    if (!navigator.geolocation) return null;

    return navigator.geolocation.watchPosition(
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
      () => {
        setIsTracking(false);
        setIsCompassMode(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
    );
  }, []);

  // 나침반 모드 시작
  const startCompassTracking = useCallback(() => {
    if (!isMobile || !window.DeviceOrientationEvent) return null;

    const handleOrientation = (event: DeviceOrientationEventiOS) => {
      // iOS와 안드로이드의 방향값 처리
      const direction = event.webkitCompassHeading ?? event.alpha ?? 0;
      setHeading(direction);
    };

    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      // iOS 13+ 권한 요청
      (DeviceOrientationEvent as any)
        .requestPermission()
        .then((response: string) => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation as EventListener, true);
          }
        })
        .catch(console.error);
    } else {
      // 안드로이드 및 이전 iOS 버전
      window.addEventListener('deviceorientation', handleOrientation as EventListener, true);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation as EventListener, true);
    };
  }, [isMobile]);

  // 초기 위치 가져오기
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // Walking 모드 체크 및 자동 트래킹 시작
  useEffect(() => {
    const isWalking = location.pathname === '/walking';
    setIsWalkingMode(isWalking);

    if (isWalking && !isTracking) {
      setIsTracking(true);
    }
  }, [location.pathname, isTracking]);

  // 트래킹 모드 관리
  useEffect(() => {
    let watchId: number | null = null;
    let compassCleanup: (() => void) | null = null;

    if (isTracking) {
      watchId = startTracking();
      if (isMobile && isCompassMode) {
        compassCleanup = startCompassTracking();
      }
    }

    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (compassCleanup) {
        compassCleanup();
      }
    };
  }, [isTracking, isCompassMode, startTracking, startCompassTracking, isMobile]);

  const handleSearch = useCallback(() => {
    if (!searchKeyword.trim()) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchKeyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK && data[0]) {
        setSearchResult({
          lat: parseFloat(data[0].y),
          lng: parseFloat(data[0].x),
        });

        setTimeout(() => {
          setSearchResult(null);
        }, 10);
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
    if (!isMobile) {
      // PC에서는 현재 위치 추적만 토글
      if (!isTracking) {
        setIsTracking(true);
        getCurrentLocation();
      } else {
        setIsTracking(false);
      }
      return;
    }

    // 모바일일 경우에만 나침반 모드까지 제공
    if (!isTracking) {
      // 트래킹 시작
      setIsTracking(true);
      setIsCompassMode(false);
      getCurrentLocation();
    } else if (!isCompassMode) {
      // 나침반 모드 시작
      setIsCompassMode(true);
    } else {
      // 모든 모드 끄기
      setIsTracking(false);
      setIsCompassMode(false);
    }
  }, [isTracking, isCompassMode, getCurrentLocation, isMobile]);

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
            className={`p-3 rounded-full shadow-md transition-all duration-300 ${
              isTracking
                ? isWalkingMode
                  ? 'text-white bg-deep-coral'
                  : 'text-white bg-light-orange'
                : 'bg-white text-gray-600'
            }`}
            onClick={handleTrackingToggle}
          >
            {isMobile && isCompassMode ? (
              <RiCompass3Line className="text-2xl animate-pulse" />
            ) : (
              <RiFocus3Line className="text-2xl" />
            )}
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
            isCompassMode,
            heading,
            onMapMove: () => {
              if (!isWalkingMode) {
                setIsTracking(false);
                setIsCompassMode(false);
              }
            },
            searchResult,
            onSearch: handleSearch,
            getCurrentLocation,
          }}
        />
      </div>
    </div>
  );
};

export default MapPage;
