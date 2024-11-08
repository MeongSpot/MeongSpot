import { useState, useEffect } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { DogList } from '@/types/dogInfo';
import { IoMdFemale } from 'react-icons/io';
import { IoMdMale } from 'react-icons/io';

const DogDetail = () => {
  const navigate = useNavigate();

  const [dog, setDog] = useState<DogList | null>({
    id: 1,
    name: '감자',
    birth: '2022-01-01',
    introduction:
      '밥을 잘 먹어요밥을 잘 먹어요밥을 잘 먹어요밥을 잘 먹어요밥을 잘 먹어요밥을 잘 먹어요밥을 잘 먹어요밥을 잘 먹어요밥을 잘 먹어요밥을 잘 먹어요밥을 잘 먹어요밥을 잘 먹어요밥을 잘 먹어요밥을 잘 먹어요',
    gender: 'FEMALE',
    isNeuter: true,
    profileImage: 'https://meongspotd107.s3.ap-northeast-2.amazonaws.com/b796affc-f6ba-4911-b606-03131adc4462_wink.png',
    age: 10,
    breed: '시고르잡종',
    personality: ['낯가려요', '적극적이에요', '겁이 없어요', '적극적이에요', '겁이 없어요'],
  });

  // 생일을 "M월 D일" 형식으로 변환
  const formatBirthDate = (birth: string) => {
    const [year, month, day] = birth.split('-');
    return `${parseInt(month)}월 ${parseInt(day)}일`;
  };

  if (!dog) return <div>강아지 정보가 없습니다.</div>;

  return (
    <div className="relative min-h-screen max-h-screen flex flex-col">
      {/* 강아지 프로필 이미지 */}
      <img className="w-full h-96 object-cover" src={dog.profileImage} alt="강아지 프로필" />

      {/* 뒤로가기 버튼 */}
      <div className="absolute flex items-center justify-start px-4 py-5 cursor-pointer" onClick={() => navigate(-1)}>
        <IoChevronBack size={24} />
      </div>

      {/* 흰색 프로필 정보 섹션 */}
      <div
        className="flex-1 relative bg-white rounded-t-3xl mt-[-20px] pb-4 pt-6 flex flex-col"
        style={{ boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.1)', maxHeight: '60vh' }} // 위쪽에만 그림자, 최대 높이 설정
      >
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full"></div>

        {/* 강아지 정보 */}
        <div className="px-5 pt-5 pb-14 flex-1 flex flex-col justify-start space-y-5 overflow-y-auto">
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold">{dog.name}</h1>
              <p className="text-sm text-gray-500 ml-2">
                {dog.gender === 'MALE' ? <IoMdMale size={24} /> : <IoMdFemale size={24} />}
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-1">{dog.breed}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button className="py-5 bg-[#ffeace] rounded-xl">
              <p className="text-lg font-semibold">{dog.age} 살</p>
              <p className="text-sm text-zinc-500">나이</p>
            </button>
            <button className="py-5 bg-[#ffeace] rounded-xl">
              <p className="text-lg font-semibold">{formatBirthDate(dog.birth)}</p> {/* 변환된 생일 표시 */}
              <p className="text-sm text-zinc-500">생일</p>
            </button>
            <button className="py-5 bg-[#ffeace] rounded-xl">
              <p className="text-lg font-semibold">{dog.isNeuter === true ? '했음' : '안했음'}</p>
              <p className="text-sm text-zinc-500">중성화</p>
            </button>
          </div>

          <div className="pt-5 space-y-2">
            <h2 className="font-semibold">성격</h2>
            <div className="flex flex-wrap gap-2">
              {dog.personality.map((personality, idx) => (
                <span key={idx} className="px-2 py-1 bg-zinc-100 rounded-md text-sm">
                  {personality}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-5 space-y-2">
            <h2 className="font-semibold">소개</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{dog.introduction}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogDetail;
