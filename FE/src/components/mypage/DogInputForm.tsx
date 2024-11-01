import DogBoxInput from '@/components/common/DogInput/DogBoxInput';
import ValidateButton from '@/components/common/Button/ValidateButton';
import ValidationMessage from '@/components/common/Message/ValidationMessage';
import React from 'react';
import { SignupData, REGEX } from '@/types/signup';
import { DogInfo } from '@/types/dogInfo';

interface DogInputFormProps {
  formData: DogInfo;
  setFormData: React.Dispatch<React.SetStateAction<DogInfo>>;
  // isDuplicateChecked: boolean;
  // setIsDuplicateChecked: (checked: boolean) => void;
}

const DogInputForm = ({ formData, setFormData }: DogInputFormProps) => {
  // 유효성 검사 조건
  const idRegex = REGEX.ID;
  // const passwordLengthValid = formData.password.length >= 8 && formData.password.length <= 16;
  // const passwordCharValid = REGEX.PASSWORD.test(formData.password);
  // const isIdValid = idRegex.test(formData.id);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'id') {
      // setIsDuplicateChecked(false);
    }
  };

  const handleDuplicateCheck = () => {
    // if (isIdValid) {
    //   // API 호출 로직이 들어갈 자리
    //   setIsDuplicateChecked(true);
    // }
  };

  return (
    <div className="flex flex-col h-full auth-content pb-16">
      <div className="space-y-6">
        {/* 이름 Input */}
        <div className="w-full">
          <div className="flex-1">
            <DogBoxInput label="이름" name="name" value={formData.name} onChange={handleChange} className="py-3" />
          </div>

          <div className="mt-2"></div>
        </div>

        {/* Password Input */}
        <div className="w-full">
          <DogBoxInput label="견종" name="breedId" value={formData.breedId} onChange={handleChange} className="py-3" />
          <div className="mt-2 space-y-1">
            {/* <ValidationMessage message="최소 8자리 이상, 최대 16자리 이하" isValid={passwordLengthValid} /> */}
            {/* <ValidationMessage message="영문자, 숫자, 특수문자 포함" isValid={passwordCharValid} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogInputForm;
