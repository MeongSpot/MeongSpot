import React, { useState } from 'react';
import { FaDog } from 'react-icons/fa';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { MeetingParticipantsInfo } from '@/types/user';
import { useDog } from '@/hooks/dog/useDog';
import DogIcon from '/icons/DogIcon.svg';
import { useNavigate } from 'react-router-dom';

interface DogCardProps {
  member: MeetingParticipantsInfo;
  meetingId: number;
}

const DogCard = ({ member, meetingId }: DogCardProps) => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const { meetingDogs, getMeetingDogs } = useDog();

  const toggleDetails = () => {
    if (showDetails === false) {
      getMeetingDogs(meetingId, member.memberId);
    }
    setShowDetails((prev) => !prev);
  };

  // 생일을 기반으로 나이를 계산하는 함수
  const calculateAge = (birthdate: string) => {
    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4 border border-gray-300 cursor-pointer" onClick={toggleDetails}>
      <div className="flex items-center mb-2">
        <div className="mr-2 w-12 h-12 rounded-full border">
          <img
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${member.memberId}`)
            }}
            src={member.profileImage || '/icons/favicon/favicon-96x96.png'} alt="" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{member.nickname}</h3>
            <div className="flex items-center space-x-2">
              <p className=" text-zinc-600">{member.birth ? `${calculateAge(member.birth)}세` : '알 수 없음'}</p>
              <div className="border-r border-zinc-400 h-4"></div>
              <p className="text-zinc-600">{member.gender === 'MALE' ? '남성' : '여성'}</p>
            </div>
          </div>
        </div>
        <div className="text-gray-500 ml-2">{showDetails ? <AiOutlineUp /> : <AiOutlineDown />}</div>
      </div>

      <div
        className={`transition-[max-height,opacity] duration-300 ease-in-out ${
          showDetails ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ overflow: 'hidden' }}
      >
        <div className="mt-4 pb-2 flex items-center space-x-1">
          <img className="w-4 h-4" src={DogIcon} alt="" />
          <p className="">
            <span className="font-semibold text-deep-coral">{member.nickname}</span>
            님과 함께하는 반려견
          </p>
        </div>
        {meetingDogs.map((dog, index) => (
          <div key={index} className="bg-[#fff4e8] p-3 rounded-xl flex flex-col space-y-3">
            <div className="flex items-center">
              <div className="w-10 h-10 mr-2 rounded-full border">
                <img src={dog.profileImage} alt="" />
              </div>
              <span className="font-semibold text-md">{dog.name}</span>
              <div className="ml-auto flex space-x-2 items-center">
                <span className="text-sm text-zinc-600">{dog.breed}</span>
                <div className="border-r border-zinc-400 h-4"></div>
                <p className="text-sm text-zinc-600">{dog.age}살</p>
              </div>
              <div className="flex flex-wrap mt-2"></div>
            </div>

            <div className="mx-2">
              {dog.personality.map((tag, index) => (
                <span key={index} className="bg-peach-orange text-white text-xs font-medium px-2 py-1 rounded-full mr-2 mb-2">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DogCard;
