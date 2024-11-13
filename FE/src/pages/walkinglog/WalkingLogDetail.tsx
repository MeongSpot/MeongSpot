import { IoChevronBack } from 'react-icons/io5';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { useWalkingLog } from '@/hooks/walkinglog/useWalkingLog';
import { useEffect, useCallback, useState } from 'react';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { Map, MapMarker, MarkerClusterer } from 'react-kakao-maps-sdk';
import type { LatLng, MapContextType, SpotImageType } from '@/types/map';
import type { SpotInfo } from '@/types/meetup';

const WalkingLogDetail = () => {
  const navigate = useNavigate();
  const { getWalkingLogDetail, walkingLogDetail } = useWalkingLog();
  const { id } = useParams();

  const [mapLevel, setMapLevel] = useState(5);
  const { currentPosition, isTracking, onMapMove, searchResult, isCompassMode, heading, isMobile } =
    useOutletContext<MapContextType>();
  const [center, setCenter] = useState<LatLng>(currentPosition);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    getWalkingLogDetail(Number(id));
  }, []);

  useEffect(() => {
    // currentPosition이 설정된 후에 center를 업데이트
    if (currentPosition) {
      setCenter(currentPosition);
      setIsInitialLoad(false);
    }
  }, [currentPosition]);

  // 초기 맵 생성
  const handleMapCreate = useCallback(
    (map: kakao.maps.Map) => {
      if (!map || !currentPosition) return;

      map.setLevel(4);
      map.setCenter(new kakao.maps.LatLng(currentPosition.lat, currentPosition.lng));
      setMapLevel(4);
      setCenter(currentPosition);
    },
    [currentPosition],
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

  if (!walkingLogDetail || !center) {
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

        <div className="w-[90%] h-64 border rounded-lg">
          {center && (
            <Map
              center={center}
              style={{ width: '100%', height: '100%' }}
              level={mapLevel}
              zoomable={!isTracking}
              draggable={!isTracking}
              onCreate={handleMapCreate}
            ></Map>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalkingLogDetail;
