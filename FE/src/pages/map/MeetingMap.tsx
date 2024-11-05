import { useRef, useState, useEffect, useMemo } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { debounce } from 'lodash';
import type { LatLng, Marker } from '../../types/map';
import Toast from '@/components/common/Message/Toast';
import { ResearchButton } from '@/components/map/ResearchButton';
import { SpotMarker } from '@/components/map/SpotMarker';

type ContextType = {
  searchKeyword: string;
  currentLocation: string;
  currentPosition: LatLng;
  isTracking: boolean;
  onMapMove: () => void;
  searchResult: LatLng | null;
  onSearch: () => void;
};

// 또는 크기를 조절하고 싶다면 비율을 유지하면서 조절
const PRESENT_SPOT_IMAGE = {
  src: '/src/assets/PresentSpot.svg',
  size: {
    width: 70, // 106의 절반
    height: 70, // 106의 절반
  },
};

const SPOT_IMAGE = {
  src: '/src/assets/Spot.svg',
  size: {
    width: 51, // 51의 약 60%
    height: 67, // 67의 약 60%
  },
};

const MeetingMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef<kakao.maps.Map>(null);
  // searchKeyword와 함께 onSearch 함수도 context에서 받아옴
  const { searchKeyword, currentPosition, isTracking, onMapMove, searchResult } = useOutletContext<ContextType>();
  const [center, setCenter] = useState<LatLng>(currentPosition);
  const [mapLevel, setMapLevel] = useState(4);
  const [centerChanged, setCenterChanged] = useState(false);
  const [allMarkers] = useState<Marker[]>([
    {
      position: {
        lat: 36.0970625,
        lng: 128.4019375,
      },
      content: '동락공원',
    },
    {
      position: {
        lat: 36.09481712799744,
        lng: 128.4088897705078,
      },
      content: '위치 1',
    },
    {
      position: {
        lat: 36.10716133091688,
        lng: 128.41798782348633,
      },
      content: '위치 2',
    },
    {
      position: {
        lat: 36.10632919842957,
        lng: 128.4041690826416,
      },
      content: '위치 3',
    },
    {
      position: {
        lat: 35.890579857658125,
        lng: 128.4789276123047,
      },
      content: '다사 체육 공원',
    },
  ]);

  // // SDK 로드 완료 여부를 확인하기 위한 상태
  // const [isSdkLoaded, setIsSdkLoaded] = useState(false);

  // // Kakao Maps SDK를 동적으로 로드
  // useEffect(() => {
  //   const loadKakaoMapSDK = () => {
  //     const kakaoMapApiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
  //     const script = document.createElement('script');
  //     script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapApiKey}&libraries=services,drawing`;
  //     script.onload = () => setIsSdkLoaded(true);
  //     document.head.appendChild(script);
  //   };

  //   if (!isSdkLoaded) {
  //     loadKakaoMapSDK();
  //   }
  // }, [isSdkLoaded]);

  const DISTANCE_THRESHOLD = 100;
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isSearchPending, setIsSearchPending] = useState(false);
  const [isProgrammaticMove, setIsProgrammaticMove] = useState(false); // 추가

  // 마커의 중심점 계산 함수
  const calculateMarkersCenter = (markers: Marker[]) => {
    if (markers.length === 0) return null;

    const sum = markers.reduce(
      (acc, marker) => ({
        lat: acc.lat + marker.position.lat,
        lng: acc.lng + marker.position.lng,
      }),
      { lat: 0, lng: 0 },
    );

    return {
      lat: sum.lat / markers.length,
      lng: sum.lng / markers.length,
    };
  };

  // 토스트 메시지 표시 함수
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const [visibleMarkers, setVisibleMarkers] = useState<Marker[]>([]);

  // 거리 계산 함수를 컴포넌트 내부로 이동
  const getDistance = (pos1: LatLng, pos2: LatLng) => {
    const lat1 = (pos1.lat * Math.PI) / 180;
    const lat2 = (pos2.lat * Math.PI) / 180;
    const lng1 = (pos1.lng * Math.PI) / 180;
    const lng2 = (pos2.lng * Math.PI) / 180;

    const R = 6371e3; // 지구 반경 (미터)
    const φ1 = lat1;
    const φ2 = lat2;
    const Δφ = lat2 - lat1;
    const Δλ = lng2 - lng1;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // 미터 단위로 반환
  };

  // 마커 필터링 함수
  const updateVisibleMarkers = (centerPos: LatLng) => {
    if (!mapRef.current) return;

    const bounds = mapRef.current.getBounds();
    const filtered = allMarkers.filter((marker) => {
      const markerLatLng = new kakao.maps.LatLng(marker.position.lat, marker.position.lng);
      const isInBounds = bounds.contain(markerLatLng);
      const distance = getDistance(centerPos, marker.position);
      // 검색 반경을 5km로 확장
      return isInBounds && distance <= 5000;
    });

    setVisibleMarkers(filtered);

    // 토스트 메시지는 검색 모드에서만 표시
    if (isSearchPending && filtered.length === 0) {
      showToastMessage('이 지역에는 스팟이 없습니다.');
    }
    setIsSearchPending(false);
  };

  // 재검색 핸들러 함수 수정
  const handleResearch = () => {
    if (mapRef.current) {
      // 먼저 버튼 숨기기
      setCenterChanged(false);

      const currentMapCenter = {
        lat: mapRef.current.getCenter().getLat(),
        lng: mapRef.current.getCenter().getLng(),
      };

      const bounds = mapRef.current.getBounds();
      const filtered = allMarkers.filter((marker) => {
        const markerLatLng = new kakao.maps.LatLng(marker.position.lat, marker.position.lng);
        const isInBounds = bounds.contain(markerLatLng);
        const distance = getDistance(currentMapCenter, marker.position);
        return isInBounds && distance <= 5000;
      });

      if (filtered.length > 0) {
        const center = calculateMarkersCenter(filtered);
        if (center) {
          setIsProgrammaticMove(true);
          // 지도 이동 완료 후에도 버튼이 나타나지 않도록 이벤트 핸들러 추가
          const moveEndHandler = () => {
            setCenterChanged(false);
            kakao.maps.event.removeListener(mapRef.current!, 'dragend', moveEndHandler);
          };
          kakao.maps.event.addListener(mapRef.current, 'dragend', moveEndHandler);

          mapRef.current.panTo(new kakao.maps.LatLng(center.lat, center.lng));
          setCenter(center);
        }
        setVisibleMarkers(filtered);
      } else {
        showToastMessage('이 지역에는 스팟이 없습니다.');
      }
    }
  };

  // 초기 로딩 시 현재 위치로 설정 및 마커 표시
  useEffect(() => {
    if (currentPosition) {
      setCenter(currentPosition);
      if (mapRef.current) {
        mapRef.current.setCenter(new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng));
        updateVisibleMarkers(currentPosition);
      }
    }
  }, [currentPosition]);

  // 지도 이동 감지
  const updateCenterWhenMapMoved = useMemo(
    () =>
      debounce((map: kakao.maps.Map) => {
        if (isProgrammaticMove) {
          setIsProgrammaticMove(false);
          setCenterChanged(false);
          return;
        }

        if (!isTracking) {
          const newCenter = {
            lat: map.getCenter().getLat(),
            lng: map.getCenter().getLng(),
          };

          setCenter(newCenter);
          onMapMove();

          // 프로그래밍적 이동이 아닐 때만 거리 체크
          if (!isProgrammaticMove) {
            const distance = getDistance(newCenter, currentPosition);
            setCenterChanged(distance > DISTANCE_THRESHOLD);
          }
        } else {
          onMapMove();
        }
      }, 300),
    [isTracking, onMapMove, currentPosition, isProgrammaticMove],
  );

  // center가 변경될 때마다 실행되는 효과 수정
  useEffect(() => {
    if (!isTracking && !isProgrammaticMove) {
      const distance = getDistance(center, currentPosition);
      setCenterChanged(distance > DISTANCE_THRESHOLD);
    } else {
      setCenterChanged(false);
    }
  }, [center, currentPosition, isTracking, isProgrammaticMove]);

  // searchResult가 변경될 때도 버튼 상태 초기화
  useEffect(() => {
    if (searchResult && mapRef.current) {
      setIsProgrammaticMove(true); // 프로그래밍적 이동 시작
      mapRef.current.setLevel(5);
      mapRef.current.panTo(new kakao.maps.LatLng(searchResult.lat, searchResult.lng));
      setCenter(searchResult);
      updateVisibleMarkers(searchResult);
      setCenterChanged(false);
    }
  }, [searchResult]);

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        center={center}
        style={{ width: '100%', height: '100%' }}
        level={mapLevel}
        zoomable={true}
        onDragEnd={() => {
          if (mapRef.current) {
            updateCenterWhenMapMoved(mapRef.current);
          }
        }}
        onZoomChanged={(target: kakao.maps.Map) => updateCenterWhenMapMoved(target)}
      >
        <MapMarker position={currentPosition} image={PRESENT_SPOT_IMAGE} />
        {visibleMarkers.map((marker) => (
          <SpotMarker
            key={`${marker.position.lat}-${marker.position.lng}`}
            marker={marker}
            onClick={() => navigate('/allMeetUpRoom/1')}
            image={SPOT_IMAGE}
          />
        ))}
      </Map>

      <Toast message={toastMessage} isVisible={showToast} onHide={() => setShowToast(false)} />

      {centerChanged && <ResearchButton onClick={handleResearch} />}
    </div>
  );
};

export default MeetingMap;
