import { useRef, useEffect, useState } from 'react';
import { useDog } from '@/hooks/dog/useDog';
import { useCallback } from 'react';
import { PiPawPrint } from 'react-icons/pi';
import { FaPaw } from 'react-icons/fa';
// or
import { TbPaw } from 'react-icons/tb';

// 컴포넌트 상단에 스타일 정의
const pawAnimationStyle = `
  @keyframes pawAnimation {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(0.8);
    }
  }
`;

export interface WalkingStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDogs: number[];
  onStopWalk: () => void;
  walkSeconds: number;
  setWalkSeconds: React.Dispatch<React.SetStateAction<number>>;
  isPaused: boolean;
  distance: number;
}

const WalkingStatusModal: React.FC<WalkingStatusModalProps> = ({
  isOpen,
  onClose,
  selectedDogs,
  onStopWalk,
  walkSeconds,
  setWalkSeconds,
  isPaused,
  distance,
}) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const { myDogsName, getMyDogsName, isFetching } = useDog();
  const [hasCheckedDogs, setHasCheckedDogs] = useState(false);

  // 강아지 데이터 가져오기
  const fetchDogs = useCallback(async () => {
    if (isFetching || hasCheckedDogs) return;

    try {
      await getMyDogsName();
      setHasCheckedDogs(true);
    } catch (error) {
      console.error('강아지 목록을 불러오는데 실패했습니다:', error);
      setHasCheckedDogs(true);
    }
  }, [getMyDogsName, isFetching, hasCheckedDogs]);

  useEffect(() => {
    // 모달이 처음 열릴 때 시작 시간 설정
    if (isOpen && startTimeRef.current === null) {
      startTimeRef.current = Date.now();
      setWalkSeconds(0);
    }

    // 타이머 로직
    if (isOpen && !isPaused) {
      intervalRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
          setWalkSeconds(elapsedSeconds);
        }
      }, 1000);
    }

    // 모달이 열릴 때 강아지 데이터 가져오기
    if (isOpen && !hasCheckedDogs) {
      fetchDogs();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isOpen, isPaused, setWalkSeconds, hasCheckedDogs, fetchDogs]);

  // 모달이 닫힐 때 초기화
  useEffect(() => {
    if (!isOpen) {
      startTimeRef.current = null;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setWalkSeconds(0);
    }
  }, [isOpen, setWalkSeconds]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num: number) => num.toString().padStart(2, '0');

    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(2)} km`;
  };

  const getSelectedDogsText = useCallback(() => {
    const selectedDogsList = selectedDogs
      .map((id) => myDogsName.find((dog) => dog.id === id))
      .filter((dog): dog is NonNullable<typeof dog> => dog !== undefined);

    if (selectedDogsList.length === 0) return '';
    if (selectedDogsList.length <= 2) {
      return `${selectedDogsList.map((dog) => dog.name).join(', ')}(이)와`;
    }
    return `${selectedDogsList[0].name} 외 ${selectedDogsList.length - 1}마리와`;
  }, [selectedDogs, myDogsName]);

  return (
    <div
      className={`absolute inset-0 z-20 flex justify-center items-end transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`bg-white rounded-t-lg w-full px-6 pt-6 max-w-md transform transition-all duration-300 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>

        <h2 className="text-lg font-bold mb-2">
          <span className="text-deep-coral font-bold">{getSelectedDogsText()}</span> 산책중
        </h2>

        <hr className="border-t-2 border-gray-100 mb-6" />

        <div className="flex justify-between items-center mb-4">
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold mb-1">{formatDistance(distance)}</p>
            <p className="text-sm text-gray-500">거리</p>
          </div>

          <button
            onClick={onStopWalk}
            className="w-16 h-16 rounded-full bg-deep-coral flex items-center justify-center mx-8 active:bg-deep-coral-dark transition-colors"
            aria-label="산책 종료"
          >
            <div className="w-6 h-6 bg-white rounded-sm"></div>
          </button>

          <div className="flex-1 text-center">
            <p className="text-2xl font-bold mb-1">{formatTime(walkSeconds)}</p>
            <p className="text-sm text-gray-500">산책시간</p>
          </div>
        </div>

        <div className="h-20 flex justify-center items-center">
          <div className="flex gap-5">
            {[0, 1, 2].map((index) => (
              <FaPaw
                key={index}
                className="text-3xl text-peach-orange"
                style={{
                  animation: 'pawAnimation 1.5s infinite',
                  animationDelay: `${index * 1.0}s`,
                  opacity: 0,
                }}
              />
            ))}
          </div>
          <style>{pawAnimationStyle}</style>
        </div>

        <div className="border-t border-gray-200 -mx-6"></div>
      </div>
    </div>
  );
};

export default WalkingStatusModal;
