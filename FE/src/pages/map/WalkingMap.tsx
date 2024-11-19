import { useState, useEffect, useCallback } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Map, CustomOverlayMap, MapMarker, Polyline } from 'react-kakao-maps-sdk';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import WalkStartModal from '@/components/map/WalkStartModal';
import WalkingStatusModal from '@/components/map/WalkingStatusModal';
import CountdownOverlay from '@/components/map/CountdownOverlay';
import WalkEndModal from '@/components/map/WalkEndModal';
import WalkCompleteModal from '@/components/map/WalkCompleteModal';
import { useWalking } from '@/hooks/map/useWalking';
import type { LatLng } from '@/types/map';
import compassSpotUrl from '/icons/CompassSpot.svg?url';

type ContextType = {
  currentPosition: LatLng;
  currentLocation: string;
  getCurrentLocation: () => void;
  isTracking: boolean;
  isCompassMode: boolean;
  heading: number | null;
  isMobile: boolean;
  setIsWalking: (walking: boolean) => void;
};

const SPOT_IMAGES = {
  present: {
    src: '/icons/PresentSpot.svg',
    size: { width: 70, height: 70 },
  },
  compass: {
    src: compassSpotUrl,
    size: { width: 70, height: 70 },
  },
} as const;

const WalkingMap = () => {
  const navigate = useNavigate();
  const { currentPosition: contextPosition, isCompassMode, heading, setIsWalking } = useOutletContext<ContextType>();
  const { startWalking, endWalking, totalDistance, isWalking, currentPosition, pathCoordinates } = useWalking();

  const [center, setCenter] = useState<LatLng>(contextPosition);
  const [mapLevel, setMapLevel] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDogs, setSelectedDogs] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [showWalkingStatus, setShowWalkingStatus] = useState(false);
  const [isEndModalOpen, setIsEndModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [walkSeconds, setWalkSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // App 컴포넌트의 상태와 동기화
  useEffect(() => {
    setIsWalking(isWalking);
  }, [isWalking, setIsWalking]);

  // 초기 모달 상태 설정
  useEffect(() => {
    if (!isWalking) {
      setIsModalOpen(true);
    }
  }, []);

  // 지도 중심 위치 자동 조정
  useEffect(() => {
    if (isWalking && currentPosition) {
      setCenter(currentPosition);
    } else {
      setCenter(contextPosition);
    }
  }, [currentPosition, contextPosition, isWalking]);

  const handleDogSelect = (dogId: number) => {
    setSelectedDogs((prev) => (prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]));
  };

  const handleStartWalkClick = () => {
    setIsModalOpen(false);
    setShowCountdown(true);
  };

  // 산책 시작 시
  const handleCountdownComplete = useCallback(async () => {
    try {
      setIsLoading(true);
      const success = await startWalking(selectedDogs);
      if (success) {
        setShowCountdown(false);
        setShowWalkingStatus(true);
        setIsWalking(true); // 여기서 Nav 바를 숨깁니다
      }
    } catch (error) {
      setIsModalOpen(true);
      setShowCountdown(false);
    } finally {
      setIsLoading(false);
    }
  }, [startWalking, selectedDogs, setIsWalking]);

  const handleStopWalk = () => {
    setIsEndModalOpen(true);
    setIsPaused(true);
  };

  const handleEndModalClose = () => {
    setIsEndModalOpen(false);
    setIsPaused(false);
  };

  // 산책 종료 시
  const handleWalkEnd = useCallback(async () => {
    try {
      const success = await endWalking();
      if (success) {
        setIsEndModalOpen(false);
        setShowWalkingStatus(false);
        setIsCompleteModalOpen(true);
        setIsWalking(false); // 여기서 Nav 바를 다시 보이게 합니다
      }
    } catch (error) {
      console.error('Failed to end walking:', error);
    }
  }, [endWalking, setIsWalking]);

  // 완료 모달 닫을 때
  const handleCompleteModalClose = () => {
    setIsCompleteModalOpen(false);
    setWalkSeconds(0);
    setSelectedDogs([]);
    setIsModalOpen(!isWalking);
    setIsWalking(false); // 여기서도 Nav 바를 보이게 합니다
  };

  // WalkingStatusModal 표시 여부에 따라 Nav 바 상태 조정
  useEffect(() => {
    setIsWalking(showWalkingStatus);
  }, [showWalkingStatus, setIsWalking]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="w-full h-full">
        <Map
          center={center}
          style={{ width: '100%', height: '100%' }}
          level={mapLevel}
          zoomable={false}
          draggable={false}
        >
          {isWalking && pathCoordinates.length > 1 && (
            <Polyline path={pathCoordinates} strokeWeight={5} strokeColor="#F25C54" strokeOpacity={0.7} />
          )}

          {isCompassMode ? (
            <CustomOverlayMap position={currentPosition || contextPosition}>
              <div
                className="relative"
                style={{
                  width: '70px',
                  height: '70px',
                  position: 'absolute',
                  left: '-35px',
                  bottom: '0px',
                }}
              >
                <div
                  className="w-full h-full"
                  style={{
                    transform: heading !== null ? `rotate(${heading}deg)` : 'none',
                    transition: 'transform 0.3s ease-out',
                  }}
                >
                  <img src={compassSpotUrl} alt="나침반" className="w-full h-full" />
                </div>
              </div>
            </CustomOverlayMap>
          ) : (
            <MapMarker position={currentPosition || contextPosition} image={SPOT_IMAGES.present} />
          )}
        </Map>
      </div>

      {!isWalking && (
        <WalkStartModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedDogs={selectedDogs}
          onDogSelect={handleDogSelect}
          onStartWalk={handleStartWalkClick}
        />
      )}

      {showCountdown && <CountdownOverlay onComplete={handleCountdownComplete} />}

      {isWalking && (
        <WalkingStatusModal
          isOpen={showWalkingStatus}
          onClose={() => setShowWalkingStatus(false)}
          selectedDogs={selectedDogs}
          onStopWalk={handleStopWalk}
          walkSeconds={walkSeconds}
          setWalkSeconds={setWalkSeconds}
          isPaused={isPaused}
          distance={totalDistance}
        />
      )}

      <WalkEndModal isOpen={isEndModalOpen} onClose={handleEndModalClose} onConfirm={handleWalkEnd} />
      <WalkCompleteModal isOpen={isCompleteModalOpen} onClose={handleCompleteModalClose} />
      {isLoading && <LoadingOverlay message="잠시만 기다려주세요..." />}
    </div>
  );
};

export default WalkingMap;
