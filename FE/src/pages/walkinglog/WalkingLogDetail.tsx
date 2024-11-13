import { IoChevronBack } from 'react-icons/io5';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { useWalkingLog } from '@/hooks/walkinglog/useWalkingLog';
import { useEffect, useCallback, useState, useMemo, useRef } from 'react';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { Map, Polyline } from 'react-kakao-maps-sdk';
import type { LatLng, MapContextType, SpotImageType } from '@/types/map';
import type { SpotInfo } from '@/types/meetup';

const WalkingLogDetail = () => {
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

  useEffect(() => {
    getWalkingLogDetail(Number(id));
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

  // 날짜 포맷 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' });
    return formattedDate.endsWith('.') ? formattedDate.slice(0, -1) : formattedDate;
  };

  // 시간 포맷 함수
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  if (!walkingLogDetail) {
    return <LoadingOverlay message="로딩 중..." />;
  }

  return (
    <div>
      <div>
        <div className="p-4 grid grid-cols-3 items-center">
          <IoChevronBack onClick={() => navigate('/walkinglog')} size={24} />
          <p className="text-center text-lg font-bold">{formatDate(walkingLogDetail.startedAt)}</p>
        </div>
        <hr />
      </div>

      <div className="p-4 flex flex-col items-center space-y-10">
        <div className="mt-5 flex space-x-10 justify-center items-center">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-[0.15rem] rounded-3xl bg-deep-coral">
              <p className="text-white">시작</p>
            </button>
            <p className="font-medium text-zinc-600">{formatTime(walkingLogDetail.startedAt)}</p>
          </div>

          <div className="flex items-center space-x-2">
            <button className="px-3 py-[0.15rem] rounded-3xl bg-deep-coral">
              <p className="text-white">종료</p>
            </button>
            <p className="font-medium text-zinc-600">{formatTime(walkingLogDetail.finishedAt)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border rounded-full">
            <img src={walkingLogDetail.dogImage} alt="" />
          </div>
          <p>{walkingLogDetail.dogName}(이)와 함께 산책했어요</p>
        </div>

        <div className="flex">
          <div className="px-5 flex flex-col items-center border-r border-zinc-300">
            <p className="text-sm text-zinc-800">산책 시간</p>
            <p className="text-2xl font-bold">{walkingLogDetail.time ? walkingLogDetail.time : 0}</p>
            <p className="text-sm text-zinc-600">분</p>
          </div>
          <div className="px-5 flex flex-col items-center">
            <p className="text-sm text-zinc-800">산책 거리</p>
            <p className="text-2xl font-bold">{walkingLogDetail.distance ? walkingLogDetail.distance.toFixed(2) : 0}</p>
            <p className="text-sm text-zinc-600">Km</p>
          </div>
        </div>

        <div className="w-[90%] h-64 border rounded-xl">
          {center && (
            <Map
              onClick={() => {navigate(`/walkinglog/${id}/map`);}}
              center={center}
              style={{ width: '100%', height: '100%', borderRadius: '0.8rem' }}
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
    </div>
  );
};

export default WalkingLogDetail;
