import { useRef, useState, useCallback, useEffect } from 'react';
import { Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { LatLng, Marker } from '../../types/map';
import Toast from '@/components/common/Message/Toast';
import { ResearchButton } from '@/components/map/ResearchButton';
import { SpotMarker } from '@/components/map/SpotMarker';
import presentSpotUrl from '/icons/PresentSpot.svg?url';
import spotUrl from '/icons/Spot.svg?url';
import type { SpotInfo } from '@/types/meetup';
import SpotModal from '@/components/map/SpotModal';

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

const MOCK_SPOT_INFO: SpotInfo[] = [
  {
    id: 1,
    position: { lat: 36.0970625, lng: 128.4019375 },
    content: '동락공원',
    meetups: [
      {
        id: 1,
        title: '아침 산책 함께해요',
        date: '2024.03.20',
        time: '07:30',
        location: '공원 정문 벤치 앞',
        participants: ['초코', '루루', '콩이'],
        maxParticipants: 6,
        currentParticipants: 3,
        tags: ['활발한_강아지_환영', '1시간정도', '소형견만'],
      },
      {
        id: 2,
        title: '저녁 산책 메이트 구해요',
        date: '2024.03.20',
        time: '19:00',
        location: '음악분수 근처',
        participants: ['보리', '해피'],
        maxParticipants: 4,
        currentParticipants: 2,
        tags: ['중형견', '장시간산책'],
      },
      {
        id: 3,
        title: '퇴근 후 산책할 친구 찾아요',
        date: '2024.03.20',
        time: '18:30',
        location: '큰 나무 아래',
        participants: ['몽이'],
        maxParticipants: 3,
        currentParticipants: 1,
        tags: ['초보견주', '소형견'],
      },
    ],
  },
  {
    id: 2,
    position: { lat: 36.09481712799744, lng: 128.4088897705078 },
    content: '구미국가산업단지',
    meetups: [
      {
        id: 4,
        title: '앞 아침 산책',
        date: '2024.03.20',
        time: '06:30',
        location: '역 광장 시계탑 앞',
        participants: ['콩이', '감자'],
        maxParticipants: 4,
        currentParticipants: 2,
        tags: ['전연령', '산책초보'],
      },
      {
        id: 5,
        title: '점심 산책 어때요?',
        date: '2024.03.20',
        time: '12:00',
        location: '역 뒷편 공원',
        participants: ['밤이', '수리', '별이'],
        maxParticipants: 5,
        currentParticipants: 3,
        tags: ['중대형견', '활발한_강아지_환영'],
      },
      {
        id: 6,
        title: '저녁 산책 모임',
        date: '2024.03.20',
        time: '20:00',
        location: '역 앞 벤치',
        participants: ['마루', '해피'],
        maxParticipants: 4,
        currentParticipants: 2,
        tags: ['소형견', '노견환영'],
      },
    ],
  },
  {
    id: 3,
    position: { lat: 36.10716133091688, lng: 128.41798782348633 },
    content: '메가박스',
    meetups: [
      {
        id: 7,
        title: '등산하면서 산책해요',
        date: '2024.03.20',
        time: '08:00',
        location: '금오산 입구 매점',
        participants: ['토리', '달이'],
        maxParticipants: 4,
        currentParticipants: 2,
        tags: ['장시간산책', '활발한_강아지_환영'],
      },
      {
        id: 8,
        title: '가벼운 산책 친구 구해요',
        date: '2024.03.20',
        time: '16:00',
        location: '주차장 입구',
        participants: ['보리', '쿠키', '나비'],
        maxParticipants: 5,
        currentParticipants: 3,
        tags: ['초보견주', '1시간정도'],
      },
      {
        id: 9,
        title: '숲길 산책할 친구 찾아요',
        date: '2024.03.20',
        time: '10:00',
        location: '금오산 둘레길 입구',
        participants: ['달래'],
        maxParticipants: 3,
        currentParticipants: 1,
        tags: ['중형견', '산책메이트'],
      },
    ],
  },
  {
    id: 4,
    position: { lat: 36.10632919842957, lng: 128.4041690826416 },
    content: '이마트',
    meetups: [
      {
        id: 10,
        title: '운동장 한바퀴 돌아요',
        date: '2024.03.20',
        time: '17:30',
        location: '운동장 정문',
        participants: ['몽실이', '하루'],
        maxParticipants: 4,
        currentParticipants: 2,
        tags: ['중형견', '1시간정도'],
      },
      {
        id: 11,
        title: '아침 조깅 메이트',
        date: '2024.03.20',
        time: '06:00',
        location: '육상 트랙',
        participants: ['바람이', '구름이', '하늘이'],
        maxParticipants: 6,
        currentParticipants: 3,
        tags: ['활발한_강아지_환영', '전연령'],
      },
      {
        id: 12,
        title: '저녁 운동 같이해요',
        date: '2024.03.20',
        time: '19:00',
        location: '체육관 앞',
        participants: ['별이', '달이'],
        maxParticipants: 4,
        currentParticipants: 2,
        tags: ['대형견', '장시간산책'],
      },
    ],
  },
  {
    id: 5,
    position: { lat: 35.890579857658125, lng: 128.4789276123047 },
    content: '다사 체육 공원',
    meetups: [
      {
        id: 13,
        title: '공원 산책 친구 구해요',
        date: '2024.03.20',
        time: '15:00',
        location: '농구장 옆 벤치',
        participants: ['보리', '콩이'],
        maxParticipants: 5,
        currentParticipants: 2,
        tags: ['소형견', '산책초보'],
      },
      {
        id: 14,
        title: '저녁 산책 모임',
        date: '2024.03.20',
        time: '18:30',
        location: '공원 놀이터 근처',
        participants: ['해피', '럭키', '초코'],
        maxParticipants: 6,
        currentParticipants: 3,
        tags: ['전연령', '1시간정도'],
      },
      {
        id: 15,
        title: '아침 산책 친구 찾아요',
        date: '2024.03.20',
        time: '07:00',
        location: '족구장 앞',
        participants: ['달이'],
        maxParticipants: 3,
        currentParticipants: 1,
        tags: ['중형견', '활발한_강아지_환영'],
      },
    ],
  },
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
  const [selectedSpot, setSelectedSpot] = useState<SpotInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchSpotsInBounds = useCallback(async (bounds: { sw: LatLng; ne: LatLng }) => {
    try {
      return MOCK_SPOT_INFO.filter(
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

  const handleSpotClick = (spot: SpotInfo) => {
    setSelectedSpot(spot);
    setIsModalVisible(true);
    setTimeout(() => setIsModalOpen(true), 10);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setSelectedSpot(null);
      setIsModalVisible(false);
    }, 500);
  };

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
          {visibleMarkers.map((marker) => {
            const spotInfo = MOCK_SPOT_INFO.find(
              (spot) => spot.position.lat === marker.position.lat && spot.position.lng === marker.position.lng,
            );
            return (
              <SpotMarker
                key={`${marker.position.lat}-${marker.position.lng}`}
                marker={marker}
                onClick={() => spotInfo && handleSpotClick(spotInfo)}
                image={SPOT_IMAGES.spot}
              />
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

      <Toast message="이 지역에는 스팟이 없습니다." isVisible={showToast} onHide={() => setShowToast(false)} />
      {centerChanged && <ResearchButton onClick={handleResearch} />}
    </div>
  );
};

export default MeetingMap;
