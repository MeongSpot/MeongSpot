import React from 'react';
import { DogList } from '@/types/dogInfo';
import { PiNotePencil } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';

interface MyDogInfoCardProps {
  dog: DogList;
  isOwnProfile: boolean;
}

const MyDogInfoCard: React.FC<MyDogInfoCardProps> = ({ dog, isOwnProfile }) => {
  const navigate = useNavigate();

  const getDogSize = (size: string) => {
    const sizeMap: Record<string, string> = {
      SMALL: '소형견',
      MEDIUM: '중형견',
      LARGE: '대형견',
    };
    return sizeMap[size] || size;
  };

  const dogInfo = [
    { label: '성별', value: dog.gender === 'MALE' ? '남' : '여' },
    { label: '중성화', value: dog.isNeuter ? '했음' : '안했음' },
    { label: '생일', value: dog.birth },
  ];

  const maxTraitsToShow = 4;
  const traitsToShow =
    dog.personality?.slice(0, dog.personality?.length === 4 ? maxTraitsToShow : maxTraitsToShow - 1) || [];
  const remainingTraitsCount = dog.personality?.length - traitsToShow.length || 0;

  return (
    <div
      onClick={() => {
        navigate(`/dog/${dog.id}`);
      }}
      className="h-[16.7rem] px-3 py-4 bg-white rounded-xl space-y-5"
    >
      <div className="px-2 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <img
            className="w-14 h-14 border rounded-full object-cover"
            src={dog.profileImage}
            alt="반려견 프로필 이미지"
          />
          <div>
            <p className="font-semibold">{dog.name}</p>
            <p className="text-xs font-medium text-zinc-500">
              {dog.breed} ({getDogSize(dog.size)})
            </p>
          </div>
        </div>
        {isOwnProfile && (
          <PiNotePencil
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/dog/${dog.id}/update`);
            }}
            className="text-2xl"
          />
        )}
      </div>

      <div className="px-4 flex flex-col space-y-4">
        <div className="space-y-[0.3rem]">
          {dogInfo.map((info, idx) => (
            <div key={idx} className="w-full flex items-start space-x-6">
              <p className="w-10 text-sm font-semibold">{info.label}</p>
              <div className="text-sm text-zinc-600 flex-1">{info.value || '정보 없음'}</div>
            </div>
          ))}
        </div>

        <div className="border-b border-zinc-200"></div>

        <div className="flex flex-wrap gap-x-3 gap-y-2">
          {traitsToShow.map((trait, index) => (
            <button key={index} className="text-[0.72rem] px-3 py-1 bg-zinc-100 rounded-full">
              # {trait}
            </button>
          ))}
          {remainingTraitsCount > 0 && (
            <span className="text-xs px-3 py-1 bg-zinc-100 rounded-full">+{remainingTraitsCount}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDogInfoCard;
