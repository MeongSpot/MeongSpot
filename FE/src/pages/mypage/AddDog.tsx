import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DogInputForm from '@/components/mypage/DogInputForm';
import { IoClose } from 'react-icons/io5';
import { DogInfo } from '@/types/dogInfo';
import FooterButton from '@/components/common/Button/FooterButton';
import useDogInfoStore from '@/store/dogInfoStore';

const AddDog: React.FC = () => {
  const navigate = useNavigate();
  const { dogRegisterInfo, setDogRegisterInfo } = useDogInfoStore();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setDogRegisterInfo({
        profile_image: imageUrl,
      });
    }
  };

  const handleRegister = () => {
    navigate('/mypage');
    resetDogInfo();
  };

  const handleBack = () => {
    navigate('/mypage');
    resetDogInfo();
  };

  const resetDogInfo = () => {
    setDogRegisterInfo({
      profile_image: '',
      name: '',
      breedId: '',
      age: null,
      size: '',
      birth: {
        year: '',
        month: '',
        day: '',
      },
      gender: '',
      isNeuter: null,
      introduction: '',
      personality: [],
    });
  };

  return (
    <div>
      <div className="p-4 grid grid-cols-3 items-center">
        <div></div>
        <p className="text-center text-lg font-bold">반려견 등록</p>
        <div className="flex justify-end">
          <IoClose
            onClick={() => {
              handleBack();
            }}
            size={24}
          />
        </div>
      </div>
      <hr />

      {/* 반려견 이미지 등록 */}
      <div className="mt-12">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-20 h-20 relative">
            <label htmlFor="fileInput">
              <img
                src={dogRegisterInfo.profile_image || '/src/assets/mypage/imageAddIcon.png'}
                alt="반려견이미지"
                className="cursor-pointer w-full h-full object-cover rounded-full"
              />
            </label>
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
          </div>
          <p className="text-sm text-zinc-400">반려견 이미지를 등록해주세요</p>
        </div>
      </div>

      {/* 반려견 정보 input */}
      <div className="mt-7 relative p-4">
        <DogInputForm formData={dogRegisterInfo} setFormData={setDogRegisterInfo} />
      </div>

      {/* 등록 버튼 */}
      <FooterButton
        onClick={() => {
          handleRegister();
        }}
        disabled={false}
      >
        등록하기
      </FooterButton>
    </div>
  );
};

export default AddDog;
