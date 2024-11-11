// WalkingStatusModal.tsx
import { useRef, useEffect } from 'react';

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

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setWalkSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, setWalkSeconds]);

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

  return (
    <div
      className={`fixed inset-0 z-20 flex justify-center items-end transition-all duration-300 mb-16 ${
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
          <span className="text-deep-coral font-bold truncate">산책중</span>
        </h2>

        <hr className="border-t-2 border-gray-100 mb-6" />

        <div className="flex justify-between items-center mb-8">
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

        <div className="border-t border-gray-200 -mx-6"></div>
      </div>
    </div>
  );
};

export default WalkingStatusModal;
