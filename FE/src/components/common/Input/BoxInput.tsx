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
  className?:string;
}

const BoxInput = ({ 
  label, 
  type = 'text', 
  value, 
  onChange,
  icon: Icon,
  showPasswordToggle = false,
  className = ''
}: BoxInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isFloating = isFocused || value.length > 0;

  return (
    <div className="relative mb-4">
      {/* Input Container */}
      <div
        className={`
          relative rounded-lg bg-white transition-all duration-200
          ${isFloating ? 'border-deep-coral' : 'border-gray-200'}
          border-[1.5px] ${className} px-4
        `}
      >
        {/* Label */}
        <div
          className={`
            pointer-events-none absolute -top-2 left-10 transition-all duration-200
            ${isFloating ? 'opacity-100' : 'opacity-0'}
          `}
        >
          <span className="bg-white px-1 text-xs text-deep-coral">
            {label}
          </span>
        </div>

        {/* Input Content */}
        <div className="flex items-center">
          {Icon && (
            <Icon className="mr-3 text-gray-400" size={20} />
          )}
          <div className="relative flex-1">
            <input
              type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
              value={value}
              onChange={onChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="w-full bg-transparent outline-none placeholder:text-gray-400"
              placeholder={!isFloating ? label : ''}
            />
          </div>
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="ml-2 text-gray-400"
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