import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DogInputForm from '@/components/mypage/DogInputForm';
import { IoClose } from 'react-icons/io5';
import { DogInfo } from '@/types/dogInfo';
import FooterButton from '@/components/common/Button/FooterButton';

const AddDog: React.FC = () => {
  const navigate = useNavigate();

  const [DogData, setDogData] = useState<DogInfo>({
    name: '',
    breedId: '',
    age: null,
    size: '',
    isNeuter: null,
    birth: {
      year: '',
      month: '',
      day: '',
    },
    gender: '',
    introduction: '',
    personality: [],
  });

  return (
    <div>
      <div className="p-4 grid grid-cols-3 items-center">
        <div></div>
        <p className="text-center text-lg font-bold">반려견 등록</p>
        <div className="flex justify-end">
          <IoClose onClick={() => navigate('/mypage')} size={24} />
        </div>
      </div>
      <hr />

      {/* 반려견 이미지 등록 */}
      <div className="mt-12">
        <div className="flex flex-col items-center space-y-3">
          <img className="w-20 h-20" src="/src/assets/mypage/imageAddIcon.png" alt="반려견이미지" />
          <p className="text-sm text-zinc-400">반려견 이미지를 등록해주세요</p>
        </div>
      </div>

      {/* 반려견 정보 input */}
      <div className="relative p-4">
        <DogInputForm formData={DogData} setFormData={setDogData} />
      </div>

      {/* 등록 버튼 */}
      <FooterButton onClick={() => {}} disabled={false}>
        등록하기
      </FooterButton>
    </div>
  );
};

export default AddDog;
