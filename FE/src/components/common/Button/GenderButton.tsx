import React from 'react';

interface GenderButtonProps {
  selected: boolean;
  onClick: () => void;
  onFocus?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

const GenderButton = ({ selected, onClick, onFocus, children }: GenderButtonProps) => {
  return (
    <button
      onClick={onClick}
      onFocus={onFocus}
      className={`w-full py-3 rounded-lg transition-colors
          ${selected ? 'bg-deep-coral text-white' : 'bg-gray-100 text-gray-500'}
        `}
    >
      {children}
    </button>
  );
};

export default GenderButton;
