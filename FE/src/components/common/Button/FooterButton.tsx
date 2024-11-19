import React from 'react';

interface FooterButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const FooterButton = ({ onClick, disabled = false, children }: FooterButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
          w-full h-16 text-white font-semibold text-lg
          ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-peach-orange hover:opacity-90'}
        `}
    >
      {children}
    </button>
  );
};

export default FooterButton;
