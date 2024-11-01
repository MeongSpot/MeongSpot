import { useRef, useState, useEffect, useMemo } from 'react';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { FaDog } from 'react-icons/fa';
import { IoMdRefresh } from 'react-icons/io';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { debounce } from 'lodash';
import type { LatLng, Marker } from '../../types/map';

type ContextType = {
  searchKeyword: string;
  currentLocation: string;
  currentPosition: LatLng;
  isTracking: boolean;
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
  const { searchKeyword, currentPosition, isTracking } = useOutletContext<ContextType>();
  const [center, setCenter] = useState<LatLng>(currentPosition);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [mapLevel, setMapLevel] = useState(5);
  const [centerChanged, setCenterChanged] = useState(false);
  const [markers, setMarkers] = useState<Marker[]>([
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

  // 지도 중심좌표 이동 감지
  const updateCenterWhenMapMoved = useMemo(
    () =>
      debounce((map: kakao.maps.Map) => {
        if (!isTracking) {
          const newCenter = {
            lat: map.getCenter().getLat(),
            lng: map.getCenter().getLng(),
          };
          setCenter(newCenter);

          // 검색 모드일 때 지도 이동하면 검색 모드 해제
          if (isSearchMode) {
            setIsSearchMode(false);
            setMapLevel(5);
          }

          // 현재 위치와 중심점의 거리가 일정 이상이면 centerChanged를 true로
          const distance = getDistance(newCenter, currentPosition);
          if (distance > 100) {
            // 100m 이상 차이나면
            setCenterChanged(true);
          }
        }
      }, 500),
    [isTracking, isSearchMode, currentPosition],
  );

  // 현재 지도 영역 내의 마커만 필터링
  const getMarkersInBounds = () => {
    if (!mapRef.current) return markers;

    const bounds = mapRef.current.getBounds();
    return markers.filter((marker) => {
      const position = new kakao.maps.LatLng(marker.position.lat, marker.position.lng);
      const distance = getDistance(center, marker.position);
      return bounds.contain(position) && distance <= 100; // 100m 이내
    });
  };

  // isTracking이 true로 변경될 때 즉시 현재 위치로 이동
  // isTracking 효과
  useEffect(() => {
    if (isTracking && mapRef.current) {
      mapRef.current.panTo(new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng));
      setCenter(currentPosition);
      setCenterChanged(false);
      setIsSearchMode(false); // 추적 모드 시작 시 검색 모드 해제
    }
  }, [isTracking, currentPosition]);

  // 검색어 처리
  useEffect(() => {
    if (!searchKeyword.trim()) return;

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(searchKeyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK && data[0]) {
        const newCenter = {
          lat: parseFloat(data[0].y),
          lng: parseFloat(data[0].x),
        };
        setCenter(newCenter);
        if (mapRef.current) {
          mapRef.current.panTo(new kakao.maps.LatLng(newCenter.lat, newCenter.lng));
        }
        setCenterChanged(true); // 검색 후 재검색 버튼 표시
      }
    });
  }, [searchKeyword]);

  // 지역 재검색 핸들러 & 내비게이션
  const handleResearch = () => {
    // 현재 위치로 이동
    if (mapRef.current) {
      mapRef.current.panTo(new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng));
    }
    setCenter(currentPosition);
    setMapLevel(3);
    setIsSearchMode(true);
    setCenterChanged(false);

    // 현재 위치 주변의 마커만 필터링
    const filteredMarkers = markers.filter((marker) => {
      const distance = getDistance(currentPosition, marker.position);
      return distance <= 100; // 100m 이내
    });
    setMarkers(filteredMarkers);
  };

  // 검색 모드에서 마커 실시간 업데이트
  useEffect(() => {
    if (isSearchMode && mapRef.current) {
      const filteredMarkers = getMarkersInBounds();
      setMarkers(filteredMarkers);
    }
  }, [center, isSearchMode]);

  // 두 지점 간의 거리 계산
  const getDistance = (pos1: LatLng, pos2: LatLng) => {
    const lat1 = (pos1.lat * Math.PI) / 180;
    const lat2 = (pos2.lat * Math.PI) / 180;
    const lng1 = (pos1.lng * Math.PI) / 180;
    const lng2 = (pos2.lng * Math.PI) / 180;

    const R = 6371e3;
    const φ1 = lat1;
    const φ2 = lat2;
    const Δφ = lat2 - lat1;
    const Δλ = lng2 - lng1;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        center={center}
        style={{ width: '100%', height: '100%' }}
        level={mapLevel}
        zoomable={true}
        onCenterChanged={updateCenterWhenMapMoved}
      >
        <MapMarker position={currentPosition} image={PRESENT_SPOT_IMAGE} />

        {markers.map((marker) => (
          <MapMarker
            key={`${marker.position.lat}-${marker.position.lng}`}
            position={marker.position}
            onClick={() => navigate('/allMeetUpRoom/1')}
            image={SPOT_IMAGE}
          />
        ))}
      </Map>

      {!isSearchMode && (
        <div className="flex flex-col gap-2 absolute z-10 top-4 right-4">
          <button
            onClick={handleResearch}
            className="flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <IoMdRefresh className="text-xl text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default MeetingMap;
