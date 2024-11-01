import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IconType } from 'react-icons';

interface BoxInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  className = '',
  name,
  disabled = false,
}: BoxInputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-4 space-y-2">
      <p className="text-sm font-medium">{label}</p>
      <div
        className={`relative rounded-lg transition-all duration-200 px-4
          border-gray-300
          ${disabled ? 'bg-gray-100 border-gray-500 text-gray-500' : 'bg-white border-[1.5px] text-gray-900'}
          ${className}
        `}
      >
        <div className="flex items-center">
          <div className="relative flex-1">
            <input
              name={name}
              type={type}
              value={value}
              onChange={onChange}
              onFocus={(e) => {
                setIsFocused(true);
                onFocus?.(e); // 기존 onFocus와 새로운 onFocus 모두 호출
              }}
              onBlur={() => setIsFocused(false)}
              className={`w-full bg-transparent outline-none placeholder:text-gray-400 ${
                disabled ? 'cursor-not-allowed' : ''
              }`}
              placeholder={isFocused ? '' : label}
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxInput;
