import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DogInputForm from '@/components/mypage/DogInputForm';
import { IoChevronBack } from 'react-icons/io5';
import { DogInfo } from '@/types/dogInfo';
import FooterButton from '@/components/common/Button/FooterButton';
import useDogInfoStore from '@/store/dogInfoStore';
import { useDog } from '@/hooks/dog/useDog';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { PersonalityList } from '@/types/dogInfo';
import DogDeleteModal from '@/components/dog/DogDeleteModal';
import { is } from 'date-fns/locale';
import DeleteConfirmModal from '@/components/dog/DeleteConfirmModal';
import { set } from 'lodash';

const UpdateDog = () => {
  const navigate = useNavigate();
  const { dogRegisterInfo, setDogRegisterInfo } = useDogInfoStore();
  const { updateDog, isLoading, getDogDetail, dogDetail, deleteDog, dogDeleteMessage } = useDog();
  const [isvalid, setIsValid] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { id } = useParams();

  // 모달 관련 변수
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] = useState(false);

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

    // 프로필 이미지 파일이 없을 경우 빈 파일로 추가
    if (dogRegisterInfo.profile_file) {
      formData.append('profileImage', dogRegisterInfo.profile_file);
    } else {
      const emptyFile = new Blob([], { type: 'image/png' }); // 빈 파일 생성 (타입은 적절히 설정)
      formData.append('profileImage', emptyFile, 'empty.png'); // 파일명도 지정 가능
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

    // formData 데이터 확인
    for (const pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    updateDog(Number(id), formData);
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
      profile_file: null,
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

  const handleDeleteDog = useCallback((dogId: number) => {
    deleteDog(dogId);
    setIsDeleteModalOpen(false);
    setIsDeleteConfirmModalOpen(true);
  }, []);

  useEffect(() => {
    getDogDetail(Number(id));
  }, [id]);

  useEffect(() => {
    if (dogDetail) {
      // 생일을 "year", "month", "day"로 분할하여 할당
      const [year, month, day] = dogDetail.birth ? dogDetail.birth.split('-') : ['', '', ''];

      // personality의 name에 해당하는 id 추출
      const personalityIds = dogDetail.personality
        .map((name) => {
          const matchingPersonality = PersonalityList.find((p) => p.name === name);
          return matchingPersonality ? matchingPersonality.id : null;
        })
        .filter((id): id is number => id !== null); // null 값을 제거하고 number 타입만 남김

      setDogRegisterInfo({
        ...dogRegisterInfo,
        profileImage: dogDetail.profileImage || '',
        name: dogDetail.name || '',
        breedId: dogDetail.breed || '',
        size: dogDetail.size || '',
        gender: dogDetail.gender || '',
        isNeuter: dogDetail.isNeuter || null,
        introduction: dogDetail.introduction || '',
        personality: personalityIds,
        birth: {
          year,
          month,
          day,
        },
      });
    }
  }, [dogDetail]);

  useEffect(() => {
    // 필수 값이 모두 채워져 있는지 확인
    const checkValidity = () => {
      const koreanNameRegex = /^[가-힣]{1,}$/;
      const requiredFields = [
        dogRegisterInfo.name,
        dogRegisterInfo.breedId,
        dogRegisterInfo.size,
        dogRegisterInfo.gender,
        dogRegisterInfo.isNeuter,
      ];

      // 생일이 과거 날짜인지 확인하는 함수
      const isPastDate = () => {
        if (!dogRegisterInfo.birth) return true; // 생일이 없으면 통과
        const { year, month, day } = dogRegisterInfo.birth;
        if (!year || !month || !day) return true; // 생일의 모든 필드가 입력되지 않았다면 통과

        const birthDate = new Date(`${year}-${month}-${day}`);
        const currentDate = new Date();

        return birthDate <= currentDate;
      };

      setIsValid(
        requiredFields.every(
          (field) =>
            field !== null &&
            field !== '' &&
            field !== undefined &&
            koreanNameRegex.test(dogRegisterInfo.name) &&
            dogRegisterInfo.personality.length > 0 &&
            isPastDate(),
        ),
      );
    };

    checkValidity();
  }, [dogRegisterInfo]);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 50); // 50ms 딜레이

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isDeleteModalOpen) {
      document.documentElement.style.overflow = 'hidden'; // html 스크롤 막기
      document.body.style.overflow = 'hidden'; // body 스크롤 막기
    } else {
      document.documentElement.style.overflow = ''; // 스크롤 복구
      document.body.style.overflow = ''; // 스크롤 복구
    }

    // 컴포넌트 언마운트 시 스크롤 복구
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isDeleteModalOpen]);

  if (isLoading) {
    return <LoadingOverlay message="로딩 중..." />;
  }

  return (
    <div className={`relative transition-transform duration-200 ${isVisible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="p-4 grid grid-cols-3 items-center">
        <div className="">
          <IoChevronBack
            onClick={() => {
              handleBack();
            }}
            size={24}
          />
        </div>
        <p className="text-center text-lg font-bold">반려견 수정</p>
        <div
          onClick={() => {
            setIsDeleteModalOpen(true);
          }}
          className="flex justify-end items-center"
        >
          <p className="text-sm font-medium text-zinc-400">삭제하기</p>
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
                className={`cursor-pointer w-full h-full object-cover rounded-full ${dogRegisterInfo.profileImage ? 'border' : ''}`}
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
        수정하기
      </FooterButton>

      {/* 반려견 삭제 모달 */}
      {dogDetail && (
        <DogDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
          }}
          onConfirm={() => {
            handleDeleteDog(dogDetail.id);
          }}
        />
      )}

      {/* 반려견 삭제 확인 모달 */}
      {dogDetail && (
        <DeleteConfirmModal
          isOpen={isDeleteConfirmModalOpen}
          onClose={() => {
            setIsDeleteConfirmModalOpen(false);
            navigate('/mypage');
          }}
          onConfirm={() => {
            handleDeleteDog(dogDetail.id);
          }}
          message={dogDeleteMessage}
        />
      )}
    </div>
  );
};

export default UpdateDog;
