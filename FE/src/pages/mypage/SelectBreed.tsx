import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import SearchBar from '@/components/common/SearchBar';
import BreedList from '@/components/mypage/BreedList';
import useDogInfoStore from '@/store/dogInfoStore';

const SelectBreed: React.FC = () => {
  const navigate = useNavigate();
  const [breedList, setBreedList] = useState([
    '직접 입력',
    '골든 리트리버',
    '그레이트 데인',
    '그레이 하우스',
    '꼬동 드 툴레아',
    '노리치 테리어',
    '노퍽 테리어',
    '닥스훈트',
    '달마티안',
    '도베르만 핀셔',
    '동경이',
    '래브라도 리트리버',
    '로트와일러',
    '말티즈',
    '불테리어',
    '슈나우저',
    '셰퍼드',
    '핀셔',
  ]);
  const [filteredBreedList, setFilteredBreedList] = useState(breedList);
  const { dogRegisterInfo, setDogRegisterInfo } = useDogInfoStore();

  return (
    <div className="space-y-3">
      <div>
        <div className="p-4 grid grid-cols-3 items-center">
          <IoChevronBack onClick={() => navigate('/registerdog')} size={24} />
          <p className="text-center text-lg font-bold">견종 선택</p>
        </div>
        <hr />
      </div>

      <div className="p-4 space-y-4">
        <SearchBar data={breedList} setData={setFilteredBreedList} placeholder="검색할 견종을 입력해주세요" />

        <BreedList data={filteredBreedList} setData={setDogRegisterInfo} />
      </div>
    </div>
  );
};

export default SelectBreed;
