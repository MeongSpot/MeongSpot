import React from 'react';
import { RiFocus3Line, RiCompass3Line } from 'react-icons/ri';

interface TrackingButtonProps {
  isTracking: boolean;
  isCompassMode: boolean;
  onClick: () => void;
  isWalkingMode: boolean;
}

const TrackingButton: React.FC<TrackingButtonProps> = ({ isTracking, isCompassMode, onClick, isWalkingMode }) => {
  return (
    <button
      className={`p-3 rounded-full shadow-md transition-all duration-300 ${
        isTracking
          ? isWalkingMode
            ? 'text-white bg-deep-coral'
            : 'text-white bg-light-orange'
          : 'bg-white text-gray-600'
      }`}
      onClick={onClick}
    >
      {isCompassMode ? <RiCompass3Line className="text-2xl animate-pulse" /> : <RiFocus3Line className="text-2xl" />}
    </button>
  );
};

export default TrackingButton;
