import React from 'react';
import { DogInfo } from '@/types/dogInfo';
import { PiNotePencil } from 'react-icons/pi';

interface MyDogInfoCardProps {
  dog: DogInfo;
}

const MyDogInfoCard: React.FC<MyDogInfoCardProps> = ({ dog }) => {
  const dogInfo = [
    { label: '성별', value: dog.gender },
    { label: '중성화', value: dog.isNeuter ? '예' : '아니오' },
    { label: '생일', value: dog.birth.year + '년 ' + dog.birth.month + '월 ' + dog.birth.day + '일' },
    { label: '소개', value: dog.introduction },
    {
      label: '성격',
      value: (
        <div className="flex flex-wrap gap-x-3 gap-y-2">
          {dog.personality?.map((trait, index) => (
            <span key={index} className="text-sm">
              #{trait}
            </span>
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-white rounded-md space-y-5">
      <div className="px-2 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img className="w-12 h-12 border rounded-full" src="" alt="반려견 프로필 이미지" />
          <p className="font-semibold">
            {dog.name} ({dog.breedId}, {dog.age}세)
          </p>
        </div>
        {/* <div className="px-2 py-1 bg-deep-coral rounded-2xl flex items-center space-x-1 cursor-pointer">
          <HiPencil className="text-white" />
          <p className="text-sm text-white">수정</p>
        </div> */}
        <PiNotePencil className="text-2xl" />
      </div>

      <div className="px-5 flex flex-col space-y-1">
        {dogInfo.map((info, idx) => (
          <div key={idx} className="w-full flex space-x-6">
            <p className="w-10 text-sm font-semibold">{info.label}</p>
            <div className="text-sm text-zinc-600 flex-1">{info.value || '정보 없음'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyDogInfoCard;
