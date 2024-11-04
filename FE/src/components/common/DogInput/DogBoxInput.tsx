import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface BoxInputProps {
  label: string;
  type?: string;
  value: string | number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
  name?: string;
  disabled?: boolean;
  onFocus?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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
  const maxNameLength = 8;
  const maxIntroductionLength = 128;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;

    // 이름 필드일 경우 최대 길이 제한
    if (label === '이름' && typeof value === 'string' && value.length > maxNameLength) {
      return;
    }

    // 반려견 소개 필드일 경우 최대 길이 제한
    if (label === '반려견 소개' && typeof value === 'string' && value.length > maxIntroductionLength) {
      return;
    }

    onChange(e);
  };

  return (
    <div className="relative mb-4 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{label}</p>
        {/* 이름과 반려견 소개의 길이 표시 */}
        {label === '이름' && typeof value === 'string' && (
          <p className="text-xs font-semibold text-gray-800">
            {value.length}
            <span className="font-normal text-zinc-500"> / {maxNameLength}자</span>
          </p>
        )}
        {label === '반려견 소개' && typeof value === 'string' && (
          <p className="text-xs font-semibold text-gray-800">
            {value.length}
            <span className="font-normal text-zinc-500"> / {maxIntroductionLength}자</span>
          </p>
        )}
      </div>
      <div
        className={`relative rounded-lg transition-all duration-200 px-4
          border-gray-300
          ${disabled ? 'bg-gray-100 border-gray-500 text-gray-500' : 'bg-white border-[1.5px] text-gray-900'}
          ${className}
        `}
      >
        <div className="flex items-center">
          <div className="relative flex-1">
            {label === '반려견 소개' ? (
              <textarea
                name={name}
                value={value ?? ''} // null일 경우 빈 문자열로 처리
                onChange={handleChange}
                onFocus={(e) => {
                  setIsFocused(true);
                  onFocus?.(e); // 기존 onFocus와 새로운 onFocus 모두 호출
                }}
                onBlur={() => setIsFocused(false)}
                className={`w-full bg-transparent outline-none placeholder:text-gray-400 resize-none ${
                  disabled ? 'cursor-not-allowed' : ''
                }`}
                placeholder={isFocused ? '' : label}
                disabled={disabled}
                maxLength={maxIntroductionLength}
                rows={4}
              />
            ) : (
              <input
                name={name}
                type={type}
                value={value ?? ''} // null일 경우 빈 문자열로 처리
                onChange={handleChange}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoxInput;
