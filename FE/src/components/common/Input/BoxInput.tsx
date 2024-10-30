import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IconType } from 'react-icons';

interface BoxInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: IconType;
  showPasswordToggle?: boolean;
  className?: string;
  name?: string;
  disabled?: boolean;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const BoxInput = ({
  label,
  type = 'text',
  value,
  onChange,
  onFocus,
  icon: Icon,
  showPasswordToggle = false,
  className = '',
  name,
  disabled = false,
}: BoxInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isFloating = isFocused || value.length > 0;

  return (
    <div className="relative mb-4">
      <div
        className={`relative rounded-lg transition-all duration-200 px-4
          ${isFloating ? 'border-deep-coral' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 border-gray-500 text-gray-500' : 'bg-white border-[1.5px] text-gray-900'}
          ${className}
        `}
      >
        <div
          className={`pointer-events-none absolute  left-10 transition-all duration-200
            ${isFloating ? 'opacity-100' : 'opacity-0'}
            ${disabled ? '-top-3' : '-top-2'}
          `}
        >
          <span className={`px-1 text-xs ${disabled ? 'text-gray-500' : 'bg-white text-deep-coral'}`}>{label}</span>
        </div>

        <div className="flex items-center">
          {Icon && <Icon className="mr-3 text-gray-400" size={20} />}
          <div className="relative flex-1">
            <input
              name={name}
              type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
              value={value}
              onChange={onChange}
              onFocus={(e) => {
                setIsFocused(true);
                onFocus?.(e);  // 기존 onFocus와 새로운 onFocus 모두 호출
              }}
              onBlur={() => setIsFocused(false)}
              className={`w-full bg-transparent outline-none placeholder:text-gray-400 ${
                disabled ? 'cursor-not-allowed' : ''
              }`}
              placeholder={!isFloating ? label : ''}
              disabled={disabled}
            />
          </div>
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-gray-400"
              disabled={disabled}
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoxInput;
