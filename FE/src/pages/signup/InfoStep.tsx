import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
import BoxInput from '@/components/common/Input/BoxInput';
import ValidateButton from '@/components/common/Button/ValidateButton';
import GenderButton from '@/components/common/Button/GenderButton';
import { SignupData, REGEX } from '@/types/signup';
import ValidationMessage from '@/components/common/Message/ValidationMessage';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';
import usePhoneVerificationStore from '@/store/usePhoneVerificationStore';

interface InfoStepProps {
  formData: SignupData;
  setFormData: React.Dispatch<React.SetStateAction<SignupData>>;
  isNicknameChecked: boolean;
  setIsNicknameChecked: (checked: boolean) => void;
  isPhoneVerified: boolean;
  setIsPhoneVerified: (verified: boolean) => void;
}

// 인증 제한 정보를 위한 interface
interface VerificationLimitInfo {
  remainingAttempts: number;
  nextAttemptTime?: string;
}

const InfoStep = ({
  formData,
  setFormData,
  isNicknameChecked,
  setIsNicknameChecked,
  isPhoneVerified,
  setIsPhoneVerified,
}: InfoStepProps) => {
  const {
    isValidating,
    validationMessage,
    phoneValidationMessage,
    isPhoneAvailable,
    checkNickname,
    checkPhone,
    sendPhoneAuthCode,
    verifyPhoneCode,
    authError,
  } = useAuth();
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [timer, setTimer] = useState<number>(180);
  const [timerActive, setTimerActive] = useState(false);
  const [isPhoneEditable, setIsPhoneEditable] = useState(true);
  const [verificationLimitInfo, setVerificationLimitInfo] = useState<VerificationLimitInfo | null>(null);
  const { attempts, canRequestVerification, incrementAttempt, timeUntilNextAttempt } = usePhoneVerificationStore();
  // 닉네임 유효성 검사
  const nicknameLength = formData.info.nickname.length >= 2 && formData.info.nickname.length <= 8;
  const nicknameContent = REGEX.NICKNAME.test(formData.info.nickname);
  const isNicknameValid = nicknameLength && nicknameContent;

  // 휴대폰 유효성 검사
  const isPhoneValid = REGEX.PHONE.test(formData.info.phone);

  // 타이머 관련 useEffect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setShowVerification(false);
      setTimerActive(false);
      setVerificationCode('');
      setIsPhoneVerified(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timer]);

  // 타이머 표시 포맷팅
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 월일 select 박스
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  // 휴대폰 번호 포맷팅 함수
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  // 인풋 핸들러
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const formatted = formatPhoneNumber(value);
      if (formatted.length <= 13) {
        setFormData((prev) => ({
          ...prev,
          info: {
            ...prev.info,
            phone: formatted,
          },
        }));

        // 전화번호가 완성되면 중복 검사 실행
        if (formatted.length === 13) {
          const rawPhone = formatted.replace(/-/g, '');
          checkPhone(rawPhone, (isAvailable) => {
            if (!isAvailable) {
              setIsPhoneEditable(true);
              setIsPhoneVerified(false);
            }
          });
        }
      }
    } else if (name === 'birth.year') {
      const yearValue = value.replace(/[^\d]/g, '');
      if (yearValue.length <= 4) {
        const yearNum = parseInt(yearValue);
        if (!yearValue || (yearNum >= 1900 && yearNum <= new Date().getFullYear())) {
          setFormData((prev) => ({
            ...prev,
            info: {
              ...prev.info,
              birth: {
                ...prev.info.birth,
                year: yearValue,
              },
            },
          }));
        }
      }
    } else if (name.startsWith('birth.')) {
      const [, field] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        info: {
          ...prev.info,
          birth: {
            ...prev.info.birth,
            [field]: value,
          },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        info: {
          ...prev.info,
          [name]: value,
        },
      }));
    }

    if (name === 'nickname') {
      setIsNicknameChecked(false);
    }
  };

  // 연도 입력 핸들러
  const handleYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value.length <= 4) {
      setFormData((prev) => ({
        ...prev,
        info: {
          ...prev.info,
          birth: {
            ...prev.info.birth,
            year: value,
          },
        },
      }));
    }
  };

  // 다시받기 버튼
  const handleResetVerification = () => {
    setIsPhoneEditable(true);
    setIsPhoneVerified(false);
    setShowVerification(false);
    setVerificationCode('');
    setTimer(180);
    setTimerActive(false);
  };

  // 셀렉트 핸들러
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('birth.')) {
      const [, field] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        info: {
          ...prev.info,
          birth: {
            ...prev.info.birth,
            [field]: value,
          },
        },
      }));
    }
  };

  // 닉네임 중복 검사 핸들러
  const handleCheckNickname = () => {
    if (!isNicknameValid) return;
    checkNickname(formData.info.nickname, setIsNicknameChecked);
  };

  // 인증하기 버튼
  const handleVerifyPhone = async () => {
    if (!canRequestVerification()) {
      const remainingTime = timeUntilNextAttempt();

      if (attempts >= 5) {
        const hours = Math.floor(remainingTime / (60 * 60 * 1000));
        alert(`일일 인증 시도 횟수를 초과했습니다. ${hours}시간 후에 다시 시도해주세요.`);
      } else {
        const seconds = Math.ceil(remainingTime / 1000);
        alert(`잠시 후에 다시 시도해주세요. (${seconds}초)`);
      }
      return;
    }

    const rawPhone = formData.info.phone.replace(/-/g, '');
    const success = await sendPhoneAuthCode(rawPhone);

    if (success) {
      incrementAttempt();
      setShowVerification(true);
      setTimer(180);
      setTimerActive(true);
      setIsPhoneEditable(false);
    }
  };
  // 인증번호 확인
  const handleConfirmVerification = async () => {
    if (!verificationCode) return;

    const rawPhone = formData.info.phone.replace(/-/g, '');
    const success = await verifyPhoneCode(rawPhone, verificationCode);

    if (success) {
      setIsPhoneVerified(true);
      setTimerActive(false);
      setShowVerification(false);
      console.log('Phone verification completed'); // 디버깅용
    }
  };

  const handleGenderSelect = (gender: 'male' | 'female') => {
    setFormData((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        gender,
      },
    }));
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  return (
    <div className="flex flex-col h-full auth-content pb-24">
      <div className="p-6">
        <h2 className="text-2xl font-bold my-8">
          회원정보를
          <br />
          입력해주세요
        </h2>
      </div>

      <div className="px-6 overflow-y-auto h-[calc(100vh-250px)]" ref={scrollContainerRef}>
        <div className="space-y-6 pb-16">
          <div className="w-full">
            <BoxInput
              label="이름"
              name="name"
              value={formData.info.name}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              className="py-4"
            />
          </div>

          <div className="w-full">
            <div className="flex gap-2 w-full">
              <div className="flex-1">
                <BoxInput
                  label="닉네임"
                  name="nickname"
                  value={formData.info.nickname}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  className="py-4"
                />
              </div>
              <ValidateButton
                onClick={handleCheckNickname}
                disabled={!isNicknameValid || isValidating || isNicknameChecked}
              >
                {isNicknameChecked ? '확인완료' : isValidating ? '확인중...' : '중복확인'}
              </ValidateButton>
            </div>
            <div className="mt-1 space-y-1">
              <ValidationMessage message="닉네임은 2~8자 사이여야 합니다" isValid={nicknameLength} />
              <ValidationMessage message="공백없이 영문, 한글, 숫자만 사용 가능합니다" isValid={nicknameContent} />
              {validationMessage && (
                <ValidationMessage
                  message={validationMessage}
                  isValid={validationMessage === '사용 가능한 닉네임입니다.'}
                />
              )}
            </div>
          </div>

          {/* 휴대폰 번호 입력 섹션 */}
          {/* 전화번호 입력 섹션 부분만 수정합니다 */}
          <div className="w-full space-y-2">
            <div className="flex gap-2 w-full">
              <div className="flex-1">
                <BoxInput
                  label="휴대폰 번호"
                  name="phone"
                  value={formData.info.phone}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  className="py-4"
                  disabled={isPhoneVerified} // 인증 완료시 입력 비활성화
                />
              </div>
              <ValidateButton
                onClick={isPhoneVerified ? handleResetVerification : handleVerifyPhone}
                disabled={
                  !isPhoneValid || !isPhoneAvailable || isValidating || isPhoneVerified || !canRequestVerification()
                }
              >
                {isPhoneVerified
                  ? '확인완료'
                  : isValidating
                    ? '전송중...'
                    : !canRequestVerification() && attempts >= 5
                      ? '시도초과'
                      : !canRequestVerification()
                        ? '인증하기'
                        : '인증하기'}
              </ValidateButton>
            </div>
            {/* 전화번호 검증 메시지 */}
            {phoneValidationMessage && (
              <ValidationMessage message={phoneValidationMessage} isValid={isPhoneAvailable} />
            )}
            {/* 인증 시도 횟수 메시지 - 인증 완료되지 않았을 때만 표시 */}
            {!isPhoneVerified && attempts > 0 && (
              <ValidationMessage message={`남은 인증 시도 횟수: ${5 - attempts}회`} isValid={attempts < 5} />
            )}
            {/* 재시도 대기 시간 메시지 - 인증 완료되지 않았을 때만 표시 */}
            {!canRequestVerification() && !isPhoneVerified && attempts < 5 && (
              <ValidationMessage
                message={`${Math.ceil(timeUntilNextAttempt() / 1000)}초 후에 재시도 가능합니다`}
                isValid={false}
              />
            )}
            {/* 인증번호 입력 섹션 */}
            {showVerification && !isPhoneVerified && (
              <div className="mt-3">
                <div className="flex gap-2 w-full mt-5">
                  <div className="flex-1">
                    <BoxInput
                      label="인증번호"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      onFocus={handleInputFocus}
                      className="py-4"
                    />
                    <div className="mt-1">
                      <ValidationMessage message={`남은 시간: ${formatTime(timer)}`} isValid={timer > 0} />
                      {authError && <ValidationMessage message="인증번호를 확인해주세요" isValid={false} />}
                    </div>
                  </div>
                  <ValidateButton onClick={handleConfirmVerification} disabled={!verificationCode}>
                    확인하기
                  </ValidateButton>
                </div>
              </div>
            )}
            {/* 인증 완료 메시지 */}
            {isPhoneVerified && <ValidationMessage message="휴대폰 인증이 완료되었습니다." isValid={true} />}
          </div>

          {/* 생년월일 입력 */}
          <div className="w-full">
            <label className="text-xs text-gray-600 mb-2 block">생년월일</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="birth.year"
                placeholder="년도 4자리"
                value={formData.info.birth.year}
                onChange={handleYearChange}
                onFocus={handleInputFocus}
                maxLength={4}
                className="w-[40%] py-4 px-4 border rounded-lg outline-none"
              />
              <select
                name="birth.month"
                value={formData.info.birth.month}
                onChange={handleSelectChange}
                onFocus={handleInputFocus}
                className="w-[30%] py-4 px-4 border rounded-lg outline-none"
              >
                <option value="">월</option>
                {months.map((month) => (
                  <option key={month} value={month.toString().padStart(2, '0')}>
                    {month}월
                  </option>
                ))}
              </select>
              <select
                name="birth.day"
                value={formData.info.birth.day}
                onChange={handleSelectChange}
                onFocus={handleInputFocus}
                className="w-[30%] py-4 px-4 border rounded-lg outline-none"
              >
                <option value="">일</option>
                {days.map((day) => (
                  <option key={day} value={day.toString().padStart(2, '0')}>
                    {day}일
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 성별 선택 */}
          <div className="w-full">
            <label className="text-xs text-gray-600 mb-2 block">성별</label>
            <div className="grid grid-cols-2 gap-2">
              <GenderButton selected={formData.info.gender === 'male'} onClick={() => handleGenderSelect('male')}>
                남
              </GenderButton>
              <GenderButton selected={formData.info.gender === 'female'} onClick={() => handleGenderSelect('female')}>
                여
              </GenderButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoStep;
