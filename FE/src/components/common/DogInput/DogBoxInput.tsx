import { is } from 'date-fns/locale';
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
  isRequired?: boolean;
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
  isRequired,
}: BoxInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // 오류 메시지 상태
  const maxNameLength = 8;
  const maxIntroductionLength = 128;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;

    // 이름 필드 유효성 검사: 한글만 허용
    if (label === '이름') {
      const koreanNameRegex = /^[가-힣ㄱ-ㅎㅏ-ㅣ]*$/;
      if (!koreanNameRegex.test(value)) {
        setErrorMessage('이름은 한글만 입력 가능합니다.');
      } else {
        setErrorMessage(''); // 유효한 경우 오류 메시지 제거
      }

      if (value.length > maxNameLength) {
        return;
      }
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
        <div className="flex items-center space-x-[0.2rem]">
          <p className="text-sm font-medium">{label}</p>
          {isRequired && <p className="text-sm text-deep-coral">*</p>}
        </div>
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
                value={value ?? ''}
                onChange={handleChange}
                onFocus={(e) => {
                  setIsFocused(true);
                  onFocus?.(e);
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
                value={value ?? ''}
                onChange={handleChange}
                onFocus={(e) => {
                  setIsFocused(true);
                  onFocus?.(e);
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
      {errorMessage && <p className="text-xs text-red-500">{errorMessage}</p>} {/* 오류 메시지 표시 */}
    </div>
  );
};

export default BoxInput;
