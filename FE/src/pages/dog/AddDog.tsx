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
import { div } from 'framer-motion/client';

const AddDog: React.FC = () => {
  const navigate = useNavigate();
  const { dogRegisterInfo, setDogRegisterInfo } = useDogInfoStore();
  const { registerDog, isLoading } = useDog();
  const [isvalid, setIsValid] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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
    const errors: string[] = [];
    const koreanNameRegex = /^[가-힣ㄱ-ㅎㅏ-ㅣ]+$/;

    // 생일이 과거 날짜인지 확인하는 함수
    const isPastDate = () => {
      const { year, month, day } = dogRegisterInfo.birth;

      const birthDate = new Date(`${year}-${month}-${day}`);
      const currentDate = new Date();

      return birthDate <= currentDate;
    };

    // 필수 필드 검증
    if (!dogRegisterInfo.profileImage) errors.push('반려견 이미지를 등록해주세요.');
    if (!dogRegisterInfo.name || !koreanNameRegex.test(dogRegisterInfo.name))
      errors.push('반려견 이름을 정확히 입력해주세요.');
    if (!dogRegisterInfo.breedId) errors.push('반려견 견종을 선택해주세요.');
    if (!dogRegisterInfo.size) errors.push('반려견 크기를 선택해주세요.');
    if (!dogRegisterInfo.gender) errors.push('반려견 성별을 선택해주세요.');
    if (!dogRegisterInfo.introduction) errors.push('반려견 소개를 입력해주세요.');
    if (dogRegisterInfo.isNeuter === null || dogRegisterInfo.isNeuter === undefined) {
      errors.push('반려견의 중성화 여부를 선택해주세요.');
    }
    if (!dogRegisterInfo.birth.year || !dogRegisterInfo.birth.month || !dogRegisterInfo.birth.day || !isPastDate()) {
      errors.push('반려견 생일을 정확히 입력해주세요.');
    }
    if (dogRegisterInfo.personality.length === 0) {
      errors.push('반려견의 성격을 선택해주세요.');
    }

    if (errors.length > 0) {
      // 에러 메시지 표시 (alert 사용)
      alert(errors.join('\n'));
      return;
    }

    const formData = new FormData();

    // 프로필 이미지 파일이 존재할 경우 추가
    if (dogRegisterInfo.profile_file) {
      formData.append('profileImage', dogRegisterInfo.profile_file);
    }

    // 문자열, 숫자, boolean 값 추가
    formData.append('name', dogRegisterInfo.name);
    formData.append('breed', dogRegisterInfo.breedId);
    formData.append('size', dogRegisterInfo.size);
    formData.append('gender', dogRegisterInfo.gender);
    formData.append('isNeuter', String(dogRegisterInfo.isNeuter)); // boolean 값도 문자열로 변환

    // 생일 추가 및 나이 계산 (Optional)
    if (dogRegisterInfo.birth.year && dogRegisterInfo.birth.month && dogRegisterInfo.birth.day) {
      const birthDate = `${dogRegisterInfo.birth.year}-${dogRegisterInfo.birth.month}-${dogRegisterInfo.birth.day}`;
      formData.append('birth', birthDate);

      const birthYear = parseInt(dogRegisterInfo.birth.year, 10);
      const currentYear = new Date().getFullYear();
      const koreanAge = currentYear - birthYear + 1; // 한국 나이 계산

      formData.append('age', koreanAge.toString());
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

    registerDog(formData);
    resetDogInfo();
  };

  const handleBack = () => {
    setIsVisible(false); // 닫기 애니메이션 시작
    setTimeout(() => {
      navigate(`/mypage`);
    }, 150); // 애니메이션 시간과 동일하게 설정

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
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50); // 50ms 딜레이

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div
      className={`min-h-screen relative transition-transform duration-300 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}
    >
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
          <div className="w-24 h-24 relative">
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
          {dogRegisterInfo.profileImage ? (
            <></>
          ) : (
            <p className="text-sm text-zinc-400 font-medium">
              반려견 이미지 등록은
              <span className="font-semibold text-zinc-600"> 필수</span>
              입니다
            </p>
          )}
        </div>
      </div>

      {/* 반려견 정보 input */}
      <div className="mt-7 relative p-4">
        <DogInputForm formData={dogRegisterInfo} setFormData={setDogRegisterInfo} isRegister={true} />
      </div>

      {/* 등록 버튼 */}
      <FooterButton
        onClick={() => {
          handleRegister();
        }}
      >
        등록하기
      </FooterButton>
    </div>
  );
};

export default AddDog;
