import React, { useState } from 'react';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { FaDog } from 'react-icons/fa';
import { DogName } from '@/types/dogInfo';

interface DogSelectionAccordionProps {
  dogs: DogName[];
  selectedDogs: number[];
  onDogSelect: (dogId: number) => void;
}

const DogSelectionAccordion: React.FC<DogSelectionAccordionProps> = ({ dogs, selectedDogs, onDogSelect }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="relative">
      {/* 아코디언 헤더 */}
      <div
        className="bg-white p-4 rounded-lg shadow border border-gray-300 cursor-pointer"
        onClick={() => setShowDetails(!showDetails)}
      >
        <div className="flex items-center">
          <FaDog className="text-gray-400 mr-2" size={24} />
          <div className="flex-1">
            <h3 className="font-bold text-base">함께할 강아지 선택하기</h3>
          </div>
          <div className="text-gray-500 ml-2">{showDetails ? <AiOutlineUp /> : <AiOutlineDown />}</div>
        </div>
      </div>

      {/* 아코디언 내용 */}
      <div
        className={` bg-white border border-gray-300 mt-1 rounded-lg ${
          showDetails ? 'max-h-[170px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
        } transition-all duration-300`}
        style={{ overflow: 'auto' }}
      >
        {dogs.map((dog) => (
          <div
            key={dog.id}
            onClick={() => onDogSelect(dog.id)}
            className={`flex items-center justify-between p-3 pl-5 cursor-pointer border-b last:border-b-0 ${
              selectedDogs.includes(dog.id) ? 'bg-cream-bg' : ''
            }`}
          >
            <span className="text-base">{dog.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DogSelectionAccordion;
