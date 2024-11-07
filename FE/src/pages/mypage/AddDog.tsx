import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DogInputForm from '@/components/mypage/DogInputForm';
import { IoClose } from 'react-icons/io5';
import { DogInfo } from '@/types/dogInfo';
import FooterButton from '@/components/common/Button/FooterButton';
import useDogInfoStore from '@/store/dogInfoStore';
import { useDog } from '@/hooks/dog/useDog';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { is } from 'date-fns/locale';

const AddDog: React.FC = () => {
  const navigate = useNavigate();
  const { dogRegisterInfo, setDogRegisterInfo } = useDogInfoStore();
  const { registerDog, isLoading } = useDog();
  const [isvalid, setIsValid] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setDogRegisterInfo({
        ...dogRegisterInfo,
        profileImage: imageUrl,
        profile_file: file, // 파일 객체 저장
      });
    }
  };

  const handleRegister = () => {
    const formData = new FormData();

    // 프로필 이미지 파일이 존재할 경우 추가
    if (dogRegisterInfo.profile_file) {
      formData.append('profileImage', dogRegisterInfo.profile_file);
    }

    // 문자열, 숫자, boolean 값 추가
    formData.append('name', dogRegisterInfo.name);
    formData.append('breed', dogRegisterInfo.breedId);
    formData.append('size', dogRegisterInfo.size);
    formData.append('age', String(dogRegisterInfo.age)); // 숫자형은 문자열로 변환하여 추가
    formData.append('gender', dogRegisterInfo.gender);
    formData.append('isNeuter', String(dogRegisterInfo.isNeuter)); // boolean 값도 문자열로 변환

    // 생일 추가 (Optional)
    if (dogRegisterInfo.birth.year && dogRegisterInfo.birth.month && dogRegisterInfo.birth.day) {
      const birthDate = `${dogRegisterInfo.birth.year}-${dogRegisterInfo.birth.month}-${dogRegisterInfo.birth.day}`;
      formData.append('birth', birthDate);
    }

    // 소개 (Optional)
    if (dogRegisterInfo.introduction) {
      formData.append('introduction', dogRegisterInfo.introduction);
    }

    // personality 배열의 각 번호를 개별적으로 추가
    if (dogRegisterInfo.personality && dogRegisterInfo.personality.length > 0) {
      dogRegisterInfo.personality.forEach((personalityId) => {
        formData.append('personality', String(personalityId));
      });
    }

    registerDog(formData); // 등록 요청 시도
  };

  const handleBack = () => {
    navigate('/mypage');
    resetDogInfo();
  };

  const resetDogInfo = () => {
    setDogRegisterInfo({
      profileImage: '',
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

  useEffect(() => {
    // 필수 값이 모두 채워져 있는지 확인
    const checkValidity = () => {
      const koreanNameRegex = /^[가-힣]{1,}$/;
      const requiredFields = [
        dogRegisterInfo.name,
        dogRegisterInfo.breedId,
        dogRegisterInfo.size,
        dogRegisterInfo.age,
        dogRegisterInfo.gender,
        dogRegisterInfo.isNeuter,
      ];
      setIsValid(
        requiredFields.every(
          (field) =>
            field !== null && field !== '' && field !== undefined && koreanNameRegex.test(dogRegisterInfo.name) && dogRegisterInfo.personality.length > 0,
        ),
      );
    };

    console.log(dogRegisterInfo.personality);

    checkValidity();
  }, [dogRegisterInfo]);

  return (
    <div>
      {isLoading && <LoadingOverlay message="로딩 중..." />}

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
                src={dogRegisterInfo.profileImage || '/icons/imageAddIcon.png'}
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
        disabled={!isvalid}
      >
        등록하기
      </FooterButton>
    </div>
  );
};

export default AddDog;
