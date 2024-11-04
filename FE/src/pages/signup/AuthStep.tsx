import BoxInput from '@/components/common/Input/BoxInput';
import ValidateButton from '@/components/common/Button/ValidateButton';
import ValidationMessage from '@/components/common/Message/ValidationMessage';
import React from 'react';
import { SignupData, REGEX } from '@/types/signup';

interface AuthStepProps {
  formData: SignupData;
  setFormData: React.Dispatch<React.SetStateAction<SignupData>>;
  isDuplicateChecked: boolean;
  setIsDuplicateChecked: (checked: boolean) => void;
}

const AuthStep = ({ formData, setFormData, setIsDuplicateChecked }: AuthStepProps) => {
  // 유효성 검사 조건
  const idRegex = REGEX.ID;
  const passwordLengthValid = formData.password.length >= 8 && formData.password.length <= 16;
  const passwordCharValid = REGEX.PASSWORD.test(formData.password);
  const isIdValid = idRegex.test(formData.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'id') {
      setIsDuplicateChecked(false);
    }
  };

  const handleDuplicateCheck = () => {
    if (isIdValid) {
      // API 호출 로직이 들어갈 자리
      setIsDuplicateChecked(true);
    }
  };

  return (
    <div className="flex flex-col h-full auth-content pb-16">
      <div className="p-6">
        <h2 className="text-2xl font-bold my-8">
          아이디와 비밀번호를
          <br />
          입력해주세요
        </h2>
      </div>

      <div className="space-y-6 px-6">
        {/* ID Input */}
        <div className="w-full">
          <div className="flex gap-2 w-full">
            <div className="flex-1">
              <BoxInput label="아이디" name="id" value={formData.id} onChange={handleChange} className="py-4" />
            </div>
            <ValidateButton onClick={handleDuplicateCheck} disabled={!isIdValid}>
              중복확인
            </ValidateButton>
          </div>
          <div className="mt-2">
            <ValidationMessage message="4~16자의 영문 소문자, 숫자만 사용 가능합니다" isValid={isIdValid} />
          </div>
        </div>

        {/* Password Input */}
        <div className="w-full">
          <BoxInput
            label="비밀번호"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            showPasswordToggle
            className="py-4"
          />
          <div className="mt-2 space-y-1">
            <ValidationMessage message="최소 8자리 이상, 최대 16자리 이하" isValid={passwordLengthValid} />
            <ValidationMessage message="영문자, 숫자, 특수문자 포함" isValid={passwordCharValid} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthStep;
