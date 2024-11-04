import React from 'react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean; // disabled prop 추가
}

const PrimaryButton = ({ 
  children, 
  onClick, 
  type = 'button',
  className = '',
  disabled = false // 기본값 false로 설정
}: PrimaryButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full rounded-lg font-semibold bg-deep-coral px-4 py-3 text-white transition-all hover:opacity-90 ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
    >
      {children}
    </button>
  ); 
};

export default PrimaryButton;