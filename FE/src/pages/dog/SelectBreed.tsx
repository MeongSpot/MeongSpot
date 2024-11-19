import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import SearchBar from '@/components/common/SearchBar';
import BreedList from '@/components/mypage/BreedList';
import useDogInfoStore from '@/store/dogInfoStore';
import { useDog } from '@/hooks/dog/useDog';

const SelectBreed: React.FC = () => {
  const navigate = useNavigate();
  const { dogBreeds, getDogBreeds, isLoading } = useDog();
  const [filteredBreedList, setFilteredBreedList] = useState(dogBreeds);
  const { dogRegisterInfo, setDogRegisterInfo } = useDogInfoStore();
  const { where, id } = useParams();

  const handleBack = () => {
    if (where === 'register') {
      navigate('/registerdog');
    } else {
      navigate(-1);
    }
  };

  useEffect(() => {
    // 반려견 품종 목록 조회
    getDogBreeds();
  }, []);

  useEffect(() => {
    setFilteredBreedList(dogBreeds);
  }, [dogBreeds]);

  return (
    <div className="space-y-3">
      <div>
        <div className="p-4 grid grid-cols-3 items-center">
          <IoChevronBack onClick={handleBack} size={24} />
          <p className="text-center text-lg font-bold">견종 선택</p>
        </div>
        <hr />
      </div>

      <div className="p-4 space-y-4">
        <SearchBar data={dogBreeds} setData={setFilteredBreedList} placeholder="검색할 견종을 입력해주세요" />

        <BreedList data={filteredBreedList} setData={setDogRegisterInfo} dogId={Number(id)} where={where} />
      </div>
    </div>
  );
};

export default SelectBreed;
