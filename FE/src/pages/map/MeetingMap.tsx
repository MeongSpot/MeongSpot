// MeetingMap.tsx
import { useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { LatLng, MapContextType, SpotImageType } from '@/types/map';
import type { SpotInfo } from '@/types/meetup';
import { spotService } from '@/services/spotService';
import { useSpot } from '@/hooks/map/useSpot';
import Toast from '@/components/common/Message/Toast';
import { ResearchButton } from '@/components/map/ResearchButton';
import { SpotMarker } from '@/components/map/SpotMarker';
import SpotModal from '@/components/map/SpotModal';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import presentSpotUrl from '/icons/PresentSpot.svg?url';
import spotUrl from '/icons/Spot.svg?url';

const SPOT_IMAGES: Record<'present' | 'spot', SpotImageType> = {
  present: {
    src: presentSpotUrl,
    size: { width: 70, height: 70 },
  },
  spot: {
    src: spotUrl,
    size: { width: 51, height: 67 },
  },
} as const;

const MeetingMap = () => {
  const navigate = useNavigate();
  const mapRef = useRef<kakao.maps.Map>(null);
  const { currentPosition, isTracking, onMapMove, searchResult } = useOutletContext<MapContextType>();

  const [center, setCenter] = useState<LatLng>(currentPosition);
  const [mapLevel, setMapLevel] = useState(5);
  const [centerChanged, setCenterChanged] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState<SpotInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isMoving, setIsMoving] = useState(false);

  const { spots, isLoading, markerKey, loadSpotsWithAPI, findSpotInfo } = useSpot({ currentPosition });

  const visibleMarkers = useMemo(
    () =>
      spots.map((spot) => ({
        position: { lat: spot.lat, lng: spot.lng },
        content: spot.name,
      })),
    [spots],
  );

  // 지도 이동 또는 줌 변경 완료 시
  const handleMapChanged = useCallback(() => {
    if (!mapRef.current || isInitialLoad || isMoving) return;

    const newCenter = {
      lat: mapRef.current.getCenter().getLat(),
      lng: mapRef.current.getCenter().getLng(),
    };

    setCenter(newCenter);
    onMapMove();

    // 중심점 이동 거리 또는 줌 레벨 변경 시 재검색 버튼 표시
    const distance = spotService.getDistance(newCenter, currentPosition);
    const levelChanged = mapRef.current.getLevel() !== mapLevel;

    setCenterChanged(distance > 100 || levelChanged);
  }, [currentPosition, isInitialLoad, onMapMove, isMoving, mapLevel]);

  // 재검색 버튼 클릭 시
  const handleResearch = useCallback(async () => {
    if (!mapRef.current) return;
    const markers = await loadSpotsWithAPI(mapRef.current);
    setShowToast(!markers?.length);
    setCenterChanged(false);
  }, [loadSpotsWithAPI]);

  // 초기 맵 생성
  const handleMapCreate = useCallback(
    async (map: kakao.maps.Map) => {
      if (!map) return;

      map.setLevel(4);
      map.setCenter(new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng));
      setMapLevel(4);
      setCenter(currentPosition);

      const markers = await loadSpotsWithAPI(map);
      setShowToast(!markers?.length);
      setIsInitialLoad(false);
    },
    [currentPosition, loadSpotsWithAPI],
  );

  const handleSpotClick = useCallback((spotInfo: SpotInfo) => {
    setSelectedSpot(spotInfo);
    setIsModalVisible(true);
    setTimeout(() => setIsModalOpen(true), 10);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedSpot(null);
      setIsModalVisible(false);
    }, 500);
  }, []);

  // 검색 결과 처리
  useEffect(() => {
    if (!mapRef.current || !searchResult) return;

    setIsMoving(true);
    const targetLatLng = new kakao.maps.LatLng(searchResult.lat, searchResult.lng);

    // 현재 중심점과 레벨
    const startCenter = mapRef.current.getCenter();
    const startLevel = mapRef.current.getLevel();

    // 목표 레벨
    const targetLevel = 4;

    // 애니메이션 시간 (밀리초)
    const duration = 500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeInOutCubic 이징 함수 적용
      const easing = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      // 현재 위치와 목표 위치 사이를 보간
      const lat = startCenter.getLat() + (targetLatLng.getLat() - startCenter.getLat()) * easing;
      const lng = startCenter.getLng() + (targetLatLng.getLng() - startCenter.getLng()) * easing;

      // 현재 레벨과 목표 레벨 사이를 보간
      const currentLevel = startLevel + (targetLevel - startLevel) * easing;

      // 지도 위치와 레벨 업데이트
      mapRef.current?.setCenter(new kakao.maps.LatLng(lat, lng));
      mapRef.current?.setLevel(Math.round(currentLevel));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 애니메이션 완료 후 처리
        setIsMoving(false);
        setMapLevel(targetLevel);
        setCenter(searchResult);

        // 즉시 해당 위치의 스팟 검색
        loadSpotsWithAPI(mapRef.current!).then((markers) => {
          setShowToast(!markers?.length);
        });
        setCenterChanged(false);
      }
    };

    // 애니메이션 시작
    requestAnimationFrame(animate);

    return () => {
      setIsMoving(false);
    };
  }, [searchResult, loadSpotsWithAPI]);

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        center={center}
        style={{ width: '100%', height: '100%' }}
        level={mapLevel}
        zoomable={true}
        draggable={true}
        onDragEnd={handleMapChanged}
        onZoomChanged={handleMapChanged}
        onCreate={handleMapCreate}
      >
        <MapMarker position={currentPosition} image={SPOT_IMAGES.present} />
        <MarkerClusterer
          key={markerKey}
          averageCenter={true}
          minLevel={6}
          calculator={[10, 30, 50]}
          styles={[
            {
              width: '40px',
              height: '40px',
              background: '#F25C54',
              color: '#ffffff',
              display: 'flex', // Flexbox 사용
              alignItems: 'center', // 세로 중앙 정렬
              justifyContent: 'center', // 가로 중앙 정렬
              borderRadius: '50%', // 완전한 원형으로
              border: '2px solid #F25C54',
              fontSize: '16px',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // 그림자 효과 추가
            },
          ]}
        >
          {visibleMarkers.map((marker) => {
            const spotInfo = findSpotInfo(marker.position.lat, marker.position.lng);
            return (
              spotInfo && (
                <SpotMarker
                  key={`${marker.position.lat}-${marker.position.lng}`}
                  marker={marker}
                  onClick={() =>
                    handleSpotClick({
                      id: spotInfo.spotId,
                      position: { lat: spotInfo.lat, lng: spotInfo.lng },
                      content: spotInfo.name,
                      meetups: [],
                    })
                  }
                  image={SPOT_IMAGES.spot}
                />
              )
            );
          })}
        </MarkerClusterer>
      </Map>

      {isModalVisible && (
        <SpotModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          spot={selectedSpot}
          onNavigateToAll={() => navigate('/allMeetUpRoom/1')}
        />
      )}

      {isLoading && <LoadingOverlay message="스팟을 찾고있습니다!" />}

      <Toast message="이 지역에는 스팟이 없습니다." isVisible={showToast} onHide={() => setShowToast(false)} />
      {centerChanged && <ResearchButton onClick={handleResearch} />}
    </div>
  );
};

export default MeetingMap;
