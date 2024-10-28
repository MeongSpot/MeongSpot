import React from 'react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const PrimaryButton = ({ 
  children, 
  onClick, 
  type = 'button',
  className = '' 
}: PrimaryButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full rounded-lg font-semibold bg-deep-coral px-4 py-3 text-white transition-all hover:opacity-90 ${className}`}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;