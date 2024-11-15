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
  // 기본 위치를 더 정확한 좌표로 설정
  const [currentPosition, setCurrentPosition] = useState<LatLng>({ lat: 36.1075658, lng: 128.415778 });
  const [locationError, setLocationError] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [isCompassMode, setIsCompassMode] = useState(false);
  const [heading, setHeading] = useState<number | null>(null);
  const [isWalkingMode, setIsWalkingMode] = useState(location.pathname === '/walking');
  const [searchResult, setSearchResult] = useState<LatLng | null>(null);

  // 모바일 디바이스 체크
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // 현재 위치 가져오기 로직 개선
  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError(true);
      return;
    }

    // 위치 권한 확인
    const checkLocationPermission = async () => {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'denied') {
          setLocationError(true);
          return;
        }
      } catch (error) {
        console.error('Permission check failed:', error);
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
          setLocationError(false);

          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.coord2Address(longitude, latitude, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK && result[0]) {
              setCurrentLocation(result[0].address.address_name);
            }
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationError(true);
          setCurrentLocation('위치를 가져올 수 없습니다');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    };

    checkLocationPermission();
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

  // 초기 위치 가져오기 effect 수정
  useEffect(() => {
    let mounted = true;

    const initializeLocation = async () => {
      try {
        if (!navigator.geolocation) {
          setLocationError(true);
          return;
        }

        // 위치 권한 상태 확인
        const permission = await navigator.permissions.query({ name: 'geolocation' });

        if (permission.state === 'granted' && mounted) {
          getCurrentLocation();
        } else if (permission.state === 'prompt' && mounted) {
          // 권한 요청 대기 상태일 때도 getCurrentLocation 실행
          getCurrentLocation();
        } else if (mounted) {
          setLocationError(true);
        }
      } catch (error) {
        if (mounted) {
          setLocationError(true);
        }
      }
    };

    initializeLocation();

    return () => {
      mounted = false;
    };
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
    if (isWalkingMode && isMobile) {
      // Walking 모드의 기존 로직 유지
      if (!isTracking) {
        setIsTracking(true);
        setIsCompassMode(false);
        getCurrentLocation();
      } else if (!isCompassMode) {
        setIsCompassMode(true);
      } else {
        setIsTracking(false);
        setIsCompassMode(false);
      }
    } else {
      // Meeting 모드일 때는 현재 위치로 이동만 수행
      getCurrentLocation();
      setIsTracking(true);
      // 잠시 후 트래킹 상태 해제
      setTimeout(() => {
        setIsTracking(false);
      }, 1000);
    }
  }, [isTracking, isCompassMode, getCurrentLocation, isMobile, isWalkingMode]);

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
            {isWalkingMode && isMobile && isCompassMode ? (
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
            isCompassMode, // 이 값이 제대로 전달되는지 확인
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
