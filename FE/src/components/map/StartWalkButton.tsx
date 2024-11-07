import React from 'react';

interface StartWalkButtonProps {
  isDisabled: boolean;
  onClick: () => void;
}

const StartWalkButton: React.FC<StartWalkButtonProps> = ({ isDisabled, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full py-4 rounded-lg text-white font-bold text-lg transition-all duration-300 ${
        isDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-deep-coral hover:bg-deep-coral/90'
      }`}
    >
      산책 시작
    </button>
  );
};

export default StartWalkButton;
