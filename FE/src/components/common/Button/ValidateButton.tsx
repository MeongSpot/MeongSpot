import React from 'react';

interface ValidateButtonProps {
  onClick: () => void;
  onFocus?: (e: React.FocusEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const ValidateButton = ({ onClick, onFocus, disabled, children }: ValidateButtonProps) => {
  return (
    <button
      onClick={onClick}
      onFocus={onFocus}
      disabled={disabled}
      className={`
          w-24 h-[59px] rounded-lg font-medium flex items-center justify-center
          ${disabled ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}
        `}
    >
      {children}
    </button>
  );
};

export default ValidateButton;
