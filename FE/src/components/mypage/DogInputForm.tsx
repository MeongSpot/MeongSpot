import DogBoxInput from '@/components/common/DogInput/DogBoxInput';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { SignupData, REGEX } from '@/types/signup';
import { DogInfo } from '@/types/dogInfo';
import { FaAngleRight } from 'react-icons/fa6';
import GenderButton from '../common/Button/GenderButton';
import DogBirthdayInput from '../common/DogInput/DogBirthdayInput';
import DogPersonalityInput from '../common/DogInput/DogPersonalityInput';

interface DogInputFormProps {
  formData: DogInfo;
  setFormData: (info: Partial<DogInfo>) => void;
  isRegister?: boolean;
  dogId?: number;
}

const DogInputForm = ({ formData, setFormData, isRegister, dogId }: DogInputFormProps) => {
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData({
      [name]: name === 'age' ? Number(value) : value,
    });
  };

  const handleGenderChange = (gender: '남' | '여') => {
    setFormData({ gender: gender === '남' ? 'MALE' : 'FEMALE' });
  };

  const handleSizeChange = (size: '대형견' | '중형견' | '소형견') => {
    setFormData({
      size: size === '대형견' ? 'LARGE' : size === '중형견' ? 'MEDIUM' : 'SMALL',
    });
  };

  const handleNeuterChange = (isNeuter: boolean) => {
    setFormData({ isNeuter });
  };

  const handlePersonalityChange = (personalityId: number) => {
    setFormData({
      personality: formData.personality.includes(personalityId)
        ? formData.personality.filter((id) => id !== personalityId)
        : [...formData.personality, personalityId],
    });
  };

  return (
    <div className="flex flex-col h-full auth-content pb-10">
      <div className="space-y-6">
        {/* 이름 Input */}
        <div className="w-full">
          <div className="flex-1">
            <DogBoxInput
              label="이름"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="py-3"
              isRequired={true}
            />
          </div>
        </div>

        {/* 견종 Input */}
        <div
          onClick={() => {
            if (isRegister) {
              navigate(`/selectbreed/register`);
            } else {
              navigate(`/selectbreed/update/${dogId}`);
            }
          }}
          className="w-full relative"
        >
          <DogBoxInput
            label="견종 선택"
            name="breedId"
            value={formData.breedId}
            onChange={handleChange}
            className="py-3 cursor-pointer"
            isRequired={true}
          />
          <FaAngleRight className="absolute right-4 top-[2.8rem] text-zinc-500" />
        </div>

        {/* 크기 선택 버튼 */}
        <div className="flex space-x-3">
          <GenderButton selected={formData.size === 'LARGE'} onClick={() => handleSizeChange('대형견')}>
            대형견
          </GenderButton>
          <GenderButton selected={formData.size === 'MEDIUM'} onClick={() => handleSizeChange('중형견')}>
            중형견
          </GenderButton>
          <GenderButton selected={formData.size === 'SMALL'} onClick={() => handleSizeChange('소형견')}>
            소형견
          </GenderButton>
        </div>

        {/* 생년월일 입력 */}
        <div className="w-full">
          <DogBirthdayInput formData={formData} setFormData={setFormData} />
        </div>

        {/* 성별 선택 버튼 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-[0.2rem]">
            <p className="text-sm font-medium">성별</p>
            <p className="text-sm text-deep-coral">*</p>
          </div>
          <div className="flex space-x-3">
            <GenderButton selected={formData.gender === 'MALE'} onClick={() => handleGenderChange('남')}>
              남
            </GenderButton>
            <GenderButton selected={formData.gender === 'FEMALE'} onClick={() => handleGenderChange('여')}>
              여
            </GenderButton>
          </div>
        </div>

        {/* 중성화 여부 버튼 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-[0.2rem]">
            <p className="text-sm font-medium">중성화 여부</p>
            <p className="text-sm text-deep-coral">*</p>
          </div>
          <div className="flex space-x-3">
            <GenderButton selected={formData.isNeuter === false} onClick={() => handleNeuterChange(false)}>
              안했음
            </GenderButton>
            <GenderButton selected={formData.isNeuter === true} onClick={() => handleNeuterChange(true)}>
              했음
            </GenderButton>
          </div>
        </div>

        {/* 반려견 소개 */}
        <div>
          <DogBoxInput
            label="반려견 소개"
            name="introduction"
            value={formData.introduction}
            onChange={handleChange}
            className="py-3"
            isRequired={true}
          />
        </div>

        {/* 반려견 성격 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-[0.2rem]">
            <p className="text-sm font-medium">반려견 성격</p>
            <p className="text-sm text-deep-coral">*</p>
          </div>
          <DogPersonalityInput value={formData.personality} onChange={handlePersonalityChange} />
        </div>
      </div>
    </div>
  );
};

export default DogInputForm;
