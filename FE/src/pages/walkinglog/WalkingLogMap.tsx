import { IoChevronBack } from 'react-icons/io5';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { useWalkingLog } from '@/hooks/walkinglog/useWalkingLog';
import { useEffect, useCallback, useState, useMemo } from 'react';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { Map, Polyline } from 'react-kakao-maps-sdk';
import type { LatLng, MapContextType, SpotImageType } from '@/types/map';
import { IoClose } from 'react-icons/io5';

const WalkingLogMap = () => {
  const navigate = useNavigate();
  const { getWalkingLogDetail } = useWalkingLog();
  const { id } = useParams();
  // 더미 데이터
  const walkingLogDetail = {
    startedAt: '2024-11-07T02:57:53.644014',
    finishedAt: '2024-11-07T02:57:53',
    dogImage: 'https://meongspotd107.s3.ap-northeast-2.amazonaws.com/661925e5-6b3b-4631-b753-4d0f1c11ee20_wink.png',
    dogName: '감자',
    time: null,
    distance: 0.1445534046379845,
    trail: [
      {
        lat: 36.107209484700626,
        lng: 128.4173797397128,
      },
      {
        lat: 36.10684687490224,
        lng: 128.4175620073311,
      },
      {
        lat: 36.10556937758879,
        lng: 128.41738358452642,
      },
      {
        lat: 36.10515872676945,
        lng: 128.41743728178403,
      },
      {
        lat: 36.10517235888565,
        lng: 128.41666575305655,
      },
      {
        lat: 36.105113713844524,
        lng: 128.41590958369622,
      },
      {
        lat: 36.105137119497094,
        lng: 128.4024289419908,
      },
    ],
  };

  const [mapLevel, setMapLevel] = useState(5);
  const {
    currentPosition = { lat: 37.5665, lng: 126.978 }, // 기본 위치 설정
    isTracking,
  } = useOutletContext<MapContextType>();
  const [center, setCenter] = useState<LatLng | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 컴포넌트가 마운트된 후 100ms 지연 후에 isVisible을 true로 설정
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    getWalkingLogDetail(Number(id));

    return () => clearTimeout(timer);
  }, [id]);

  useEffect(() => {
    if (walkingLogDetail?.trail && walkingLogDetail.trail.length > 0 && isInitialLoad) {
      const firstTrailPosition = walkingLogDetail.trail[0];
      setCenter({ lat: firstTrailPosition.lat, lng: firstTrailPosition.lng });
      setIsInitialLoad(false); // 초기 설정 후 다시 호출되지 않도록 설정
    }
  }, [walkingLogDetail, isInitialLoad]);

  // Polyline 경로 설정
  const trailPath = useMemo(() => {
    return (
      walkingLogDetail?.trail.map((point) => ({
        lat: point.lat,
        lng: point.lng,
      })) || []
    );
  }, [walkingLogDetail]);

  const fitBoundsToPath = useCallback(
    (map: kakao.maps.Map) => {
      if (trailPath.length > 0) {
        const bounds = new kakao.maps.LatLngBounds();
        trailPath.forEach((point) => {
          bounds.extend(new kakao.maps.LatLng(point.lat, point.lng));
        });
        map.setBounds(bounds); // 경로가 모두 보이도록 지도의 범위 설정
        setIsLoading(false);
      }
    },
    [trailPath],
  );

  const handleClose = () => {
    setIsVisible(false); // 닫기 애니메이션 시작
    setTimeout(() => {
      navigate(`/walkinglog/${id}`);
    }, 150); // 애니메이션 시간과 동일하게 설정
  };

  if (!walkingLogDetail) {
    return <LoadingOverlay message="로딩 중..." />;
  }

  return (
    <div
      className={`min-h-screen fixed top-0 left-0 w-full bg-white transition-transform duration-300 ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div>
        <div className="p-4 grid grid-cols-3 items-center">
          <div></div>
          <div></div>
          <div className="w-full flex justify-end">
            <IoClose onClick={handleClose} size={25} />
          </div>
        </div>
        <hr />
      </div>
      <div className="w-full" style={{ height: '100vh' }}>
        {center && (
          <Map
            center={center}
            style={{ width: '100%', height: '100%' }}
            level={mapLevel}
            zoomable={!isTracking}
            draggable={!isTracking}
            onCreate={fitBoundsToPath}
          >
            <Polyline
              path={trailPath}
              strokeWeight={5} // 선 두께
              strokeColor="#F25C54" // 선 색상
              strokeOpacity={0.8} // 선 투명도
              strokeStyle="solid" // 선 스타일
            />
          </Map>
        )}
      </div>
    </div>
  );
};

export default WalkingLogMap;
