import DogBoxInput from '@/components/common/DogInput/DogBoxInput';
import ValidateButton from '@/components/common/Button/ValidateButton';
import ValidationMessage from '@/components/common/Message/ValidationMessage';
import React from 'react';
import { SignupData, REGEX } from '@/types/signup';
import { DogInfo } from '@/types/dogInfo';
import { FaAngleRight } from 'react-icons/fa6';
import GenderButton from '../common/Button/GenderButton';
import DogBirthdayInput from '../common/DogInput/DogBirthdayInput';
import DogPersonalityInput from '../common/DogInput/DogPersonalityInput';

interface DogInputFormProps {
  formData: DogInfo;
  setFormData: React.Dispatch<React.SetStateAction<DogInfo>>;
}

const DogInputForm = ({ formData, setFormData }: DogInputFormProps) => {
  const idRegex = REGEX.ID;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (gender: '남' | '여') => {
    setFormData((prev) => ({
      ...prev,
      gender,
    }));
  };

  const handleSizeChange = (size: '대형견' | '중형견' | '소형견') => {
    setFormData((prev) => ({
      ...prev,
      size,
    }));
  };

  const handleNeuterChange = (isNeuter: boolean) => {
    setFormData((prev) => ({
      ...prev,
      isNeuter,
    }));
  };

  const handlePersonalityChange = (personalityId: number) => {
    setFormData((prev) => ({
      ...prev,
      personality: prev.personality.includes(personalityId)
        ? prev.personality.filter((id) => id !== personalityId)
        : [...prev.personality, personalityId],
    }));
  };

  return (
    <div className="flex flex-col h-full auth-content pb-16">
      <div className="space-y-6">
        {/* 이름 Input */}
        <div className="w-full">
          <div className="flex-1">
            <DogBoxInput label="이름" name="name" value={formData.name} onChange={handleChange} className="py-3" />
          </div>
        </div>

        {/* 견종 Input */}
        <div className="w-full relative">
          <DogBoxInput
            label="견종 선택"
            name="breedId"
            value={formData.breedId}
            onChange={handleChange}
            className="py-3"
          />
          <FaAngleRight className="absolute right-4 top-[2.8rem] text-zinc-500" />
        </div>

        {/* 크기 선택 버튼 */}
        <div className="flex space-x-3">
          <GenderButton selected={formData.size === '대형견'} onClick={() => handleSizeChange('대형견')}>
            대형견
          </GenderButton>
          <GenderButton selected={formData.size === '중형견'} onClick={() => handleSizeChange('중형견')}>
            중형견
          </GenderButton>
          <GenderButton selected={formData.size === '소형견'} onClick={() => handleSizeChange('소형견')}>
            소형견
          </GenderButton>
        </div>

        {/* 나이 입력 Input */}
        <div>
          <DogBoxInput
            label="나이"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="py-3"
            type={'number'}
          />
        </div>

        {/* 성별 선택 버튼 */}
        <div className="space-y-2">
          <p className="text-sm font-medium">성별</p>
          <div className="flex space-x-3">
            <GenderButton selected={formData.gender === '남'} onClick={() => handleGenderChange('남')}>
              남
            </GenderButton>
            <GenderButton selected={formData.gender === '여'} onClick={() => handleGenderChange('여')}>
              여
            </GenderButton>
          </div>
        </div>

        {/* 중성화 여부 버튼 */}
        <div className="space-y-2">
          <p className="text-sm font-medium">중성화 여부</p>
          <div className="flex space-x-3">
            <GenderButton selected={formData.isNeuter === false} onClick={() => handleNeuterChange(false)}>
              안했음
            </GenderButton>
            <GenderButton selected={formData.isNeuter === true} onClick={() => handleNeuterChange(true)}>
              했음
            </GenderButton>
          </div>
        </div>

        {/* 생년월일 입력 */}
        <div className="w-full">
          <DogBirthdayInput formData={formData} setFormData={setFormData} />
        </div>

        {/* 반려견 소개 */}
        <div>
          <DogBoxInput
            label="반려견 소개"
            name="introduction"
            value={formData.introduction}
            onChange={handleChange}
            className="py-3"
          />
        </div>

        {/* 반려견 성격 */}
        <div className="space-y-2">
          <p className="text-sm font-medium">반려견 성격</p>
          <DogPersonalityInput value={formData.personality} onChange={handlePersonalityChange} />
        </div>
      </div>
    </div>
  );
};

export default DogInputForm;
