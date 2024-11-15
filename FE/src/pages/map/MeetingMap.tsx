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
import useMapStore from '@/store/useMapStore';
import NearbySpotModal from '@/components/map/NearbySpotModal';
import { MdLocationOn } from 'react-icons/md';

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
  const { currentPosition, isTracking, onMapMove, searchResult, isMobile } = useOutletContext<MapContextType>();
  const {
    lastPosition,
    selectedSpot: storedSpot,
    isModalOpen: storedIsModalOpen,
    setLastPosition,
    setModalOpen,
    setSelectedSpot,
  } = useMapStore();
  const [center, setCenter] = useState<LatLng>(() => {
    // 페이지 이동 후 돌아온 경우 (lastPosition이 있는 경우)
    if (lastPosition) {
      return lastPosition;
    }
    // 새로고침이나 첫 진입인 경우
    return currentPosition;
  });
  const [mapLevel, setMapLevel] = useState(5);
  const [centerChanged, setCenterChanged] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedSpot, setLocalSelectedSpot] = useState<SpotInfo | null>(storedSpot);
  const [isModalOpen, setIsModalOpen] = useState(storedIsModalOpen);
  const [isModalVisible, setIsModalVisible] = useState(storedIsModalOpen);
  const [isMoving, setIsMoving] = useState(false);
  const [showNearbyModal, setShowNearbyModal] = useState(false);
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

    const distance = spotService.getDistance(newCenter, currentPosition);
    const levelChanged = mapRef.current.getLevel() !== mapLevel;
    setCenterChanged(distance > 100 || levelChanged);
  }, [currentPosition, isInitialLoad, onMapMove, isMoving, mapLevel]);

  // 재검색 버튼 클릭 시
  const handleResearch = useCallback(async () => {
    if (!mapRef.current) return;
    const newCenter = {
      lat: mapRef.current.getCenter().getLat(),
      lng: mapRef.current.getCenter().getLng(),
    };
    const markers = await loadSpotsWithAPI(mapRef.current);
    if (markers) {
      setLastPosition(newCenter); // 재검색 시 위치 저장
    }
    setShowToast(!markers?.length);
    setCenterChanged(false);
  }, [loadSpotsWithAPI, setLastPosition]);

  // 스팟 검색하는 시점에 위치 저장 - 초기 맵 생성 로직 개선
  const handleMapCreate = useCallback(
    async (map: kakao.maps.Map) => {
      if (!map) return;

      try {
        const level = 4;
        map.setLevel(level);

        // 초기 중심점 설정
        const initialCenter = lastPosition || currentPosition;

        // 지도 중심점 설정
        map.setCenter(new kakao.maps.LatLng(initialCenter.lat, initialCenter.lng));
        setMapLevel(level);
        setCenter(initialCenter);

        // 약간의 지연 후 스팟 로드 (지도가 완전히 로드된 후)
        setTimeout(async () => {
          const markers = await loadSpotsWithAPI(map);
          if (markers && !lastPosition) {
            setLastPosition(initialCenter);
          }
          setShowToast(!markers?.length);
          setIsInitialLoad(false);
        }, 100);
      } catch (error) {
        setIsInitialLoad(false);
      }
    },
    [currentPosition, lastPosition, loadSpotsWithAPI, setLastPosition],
  );

  // modal 관련 핸들러 수정
  const handleSpotClick = useCallback(
    (spotInfo: SpotInfo) => {
      setLocalSelectedSpot(spotInfo);
      setSelectedSpot(spotInfo); // store에 저장
      setIsModalVisible(true);
      setTimeout(() => {
        setIsModalOpen(true);
        setModalOpen(true); // store에 저장
      }, 10);
    },
    [setSelectedSpot, setModalOpen],
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setModalOpen(false); // store에서도 닫기
    setTimeout(() => {
      setLocalSelectedSpot(null);
      setSelectedSpot(null); // store에서도 제거
      setIsModalVisible(false);
    }, 500);
  }, [setSelectedSpot, setModalOpen]);

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

      // 검색 결과 처리의 마지막 부분 수정
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsMoving(false);
        setMapLevel(targetLevel);
        setCenter(searchResult);

        loadSpotsWithAPI(mapRef.current!).then((markers) => {
          if (markers) {
            setLastPosition(searchResult); // 검색어로 검색 시 위치 저장
          }
          setShowToast(!markers?.length);
        });
        setCenterChanged(false);
      }
    };

    requestAnimationFrame(animate);

    return () => {
      setIsMoving(false);
    };
  }, [searchResult, loadSpotsWithAPI]);

  // isTracking 상태가 변경될 때 현재 위치로 이동하는 effect 추가
  useEffect(() => {
    if (isTracking && mapRef.current) {
      setIsMoving(true);
      const targetLatLng = new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng);

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
          setIsMoving(false);
          setMapLevel(targetLevel);
          setCenter(currentPosition);

          // 현재 위치에서 스팟 다시 로드
          loadSpotsWithAPI(mapRef.current!).then((markers) => {
            if (markers) {
              setLastPosition(currentPosition);
            }
            setShowToast(!markers?.length);
          });
          setCenterChanged(false);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isTracking, currentPosition]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="w-full h-full">
        <Map
          ref={mapRef}
          center={center}
          style={{ width: '100%', height: '100%' }}
          level={mapLevel}
          zoomable={!isTracking}
          draggable={!isTracking}
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                border: '2px solid #F25C54',
                fontSize: '16px',
                fontWeight: '600',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
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
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={() => setShowNearbyModal(true)}
            className="flex items-center gap-2 bg-white text-deep-coral font-semibold py-3 px-5 rounded-xl shadow-lg hover:bg-gray-50 transition-colors"
          >
            {/* <MdLocationOn /> */}내 주변 멍스팟 추천
          </button>
        </div>

        <NearbySpotModal isOpen={showNearbyModal} onClose={() => setShowNearbyModal(false)} />
      </div>

      {isModalVisible && (
        <SpotModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          spot={selectedSpot}
          onNavigateToAll={() =>
            navigate(`/allmeetuproom/${selectedSpot?.id}`, {
              state: {
                spotName: selectedSpot?.content,
              },
            })
          }
        />
      )}

      {isLoading && <LoadingOverlay message="스팟을 찾고있습니다!" />}

      <Toast message="이 지역에는 스팟이 없습니다." isVisible={showToast} onHide={() => setShowToast(false)} />
      {centerChanged && <ResearchButton onClick={handleResearch} />}
    </div>
  );
};

export default MeetingMap;
