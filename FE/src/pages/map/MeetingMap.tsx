import { useRef, useState, useCallback, useEffect } from 'react';
import { Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { LatLng, Marker } from '../../types/map';
import Toast from '@/components/common/Message/Toast';
import { ResearchButton } from '@/components/map/ResearchButton';
import { SpotMarker } from '@/components/map/SpotMarker';
import presentSpotUrl from '@/assets/PresentSpot.svg?url';
import spotUrl from '@/assets/Spot.svg?url';

type ContextType = {
  currentPosition: LatLng;
  isTracking: boolean;
  onMapMove: () => void;
  searchResult: LatLng | null;
};

const SPOT_IMAGES = {
  present: {
    src: presentSpotUrl,
    size: { width: 70, height: 70 },
  },
  spot: {
    src: spotUrl,
    size: { width: 51, height: 67 },
  },
} as const;

const getDistance = (pos1: LatLng, pos2: LatLng) => {
  const R = 6371e3;
  const φ1 = (pos1.lat * Math.PI) / 180;
  const φ2 = (pos2.lat * Math.PI) / 180;
  const Δφ = ((pos2.lat - pos1.lat) * Math.PI) / 180;
  const Δλ = ((pos2.lng - pos1.lng) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// 임시 데이터
const MOCK_SPOTS = [
  { position: { lat: 36.0970625, lng: 128.4019375 }, content: '동락공원' },
  { position: { lat: 36.09481712799744, lng: 128.4088897705078 }, content: '위치 1' },
  { position: { lat: 36.10716133091688, lng: 128.41798782348633 }, content: '위치 2' },
  { position: { lat: 36.10632919842957, lng: 128.4041690826416 }, content: '위치 3' },
  { position: { lat: 35.890579857658125, lng: 128.4789276123047 }, content: '다사 체육 공원' },
];

const MeetingMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef<kakao.maps.Map>(null);
  const { currentPosition, isTracking, onMapMove, searchResult } = useOutletContext<ContextType>();

  const [center, setCenter] = useState<LatLng>(currentPosition);
  const [mapLevel, setMapLevel] = useState(4);
  const [centerChanged, setCenterChanged] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [visibleMarkers, setVisibleMarkers] = useState<Marker[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchSpotsInBounds = useCallback(async (bounds: { sw: LatLng; ne: LatLng }) => {
    try {
      return MOCK_SPOTS.filter(
        (spot) =>
          spot.position.lat >= bounds.sw.lat &&
          spot.position.lat <= bounds.ne.lat &&
          spot.position.lng >= bounds.sw.lng &&
          spot.position.lng <= bounds.ne.lng,
      );
    } catch (error) {
      console.error('Failed to fetch spots:', error);
      return [];
    }
  }, []);

  const loadSpotsForBounds = useCallback(
    async (map: kakao.maps.Map) => {
      const bounds = map.getBounds();
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      const spots = await fetchSpotsInBounds({
        sw: { lat: sw.getLat(), lng: sw.getLng() },
        ne: { lat: ne.getLat(), lng: ne.getLng() },
      });

      setVisibleMarkers(spots);
      setShowToast(spots.length === 0);
      return spots;
    },
    [fetchSpotsInBounds],
  );

  // 지도 이동 시
  const handleMapMoved = useCallback(() => {
    if (!mapRef.current || isInitialLoad) return;

    const newCenter = {
      lat: mapRef.current.getCenter().getLat(),
      lng: mapRef.current.getCenter().getLng(),
    };

    setCenter(newCenter);
    onMapMove();

    if (!centerChanged) {
      const distance = getDistance(newCenter, currentPosition);
      setCenterChanged(distance > 100);
    }
  }, [currentPosition, centerChanged, isInitialLoad, onMapMove]);

  // 줌 레벨 변경 시
  const handleZoomChanged = useCallback(
    (map: kakao.maps.Map) => {
      setMapLevel(Math.min(Math.max(map.getLevel(), 1), 13));
      onMapMove();
    },
    [onMapMove],
  );

  // 재검색 버튼 클릭 시
  const handleResearch = useCallback(async () => {
    if (!mapRef.current) return;
    await loadSpotsForBounds(mapRef.current);
    setCenterChanged(false);
  }, [loadSpotsForBounds]);

  // 초기 로드 시
  const handleMapCreate = useCallback(
    (map: kakao.maps.Map) => {
      if (!map) return;

      map.setLevel(4);
      map.setCenter(new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng));
      setMapLevel(4);
      setCenter(currentPosition);

      // 초기 스팟 로드
      loadSpotsForBounds(map).finally(() => {
        setIsInitialLoad(false);
      });
    },
    [currentPosition, loadSpotsForBounds],
  );

  // 검색 결과 처리
  useEffect(() => {
    if (!mapRef.current || !searchResult) return;

    const handleSearch = async () => {
      mapRef.current!.setLevel(5);
      mapRef.current!.setCenter(new kakao.maps.LatLng(searchResult.lat, searchResult.lng));
      setMapLevel(5);
      setCenter(searchResult);
      await loadSpotsForBounds(mapRef.current!);
      setCenterChanged(false);
    };

    handleSearch();
  }, [searchResult, loadSpotsForBounds]);

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        center={center}
        style={{ width: '100%', height: '100%' }}
        level={mapLevel}
        zoomable={true}
        draggable={true}
        onDragEnd={handleMapMoved}
        onZoomChanged={handleZoomChanged}
        onCreate={handleMapCreate}
      >
        <MapMarker position={currentPosition} image={SPOT_IMAGES.present} />
        <MarkerClusterer
          averageCenter={true}
          minLevel={6}
          calculator={[10, 30, 50]}
          styles={[
            {
              width: '30px',
              height: '30px',
              background: '#ff6b6b',
              color: '#fff',
              textAlign: 'center',
              lineHeight: '30px',
              borderRadius: '15px',
              border: '2px solid #ff6b6b',
              fontSize: '14px',
              fontWeight: 'bold',
            },
          ]}
        >
          {visibleMarkers.map((marker) => (
            <SpotMarker
              key={`${marker.position.lat}-${marker.position.lng}`}
              marker={marker}
              onClick={() => navigate('/allMeetUpRoom/1')}
              image={SPOT_IMAGES.spot}
            />
          ))}
        </MarkerClusterer>
      </Map>

      <Toast message="이 지역에는 스팟이 없습니다." isVisible={showToast} onHide={() => setShowToast(false)} />
      {centerChanged && <ResearchButton onClick={handleResearch} />}
    </div>
  );
};

export default MeetingMap;
