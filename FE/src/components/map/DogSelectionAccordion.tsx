import React, { useState } from 'react';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import { FaDog } from 'react-icons/fa';

interface Dog {
  id: number;
  name: string;
  age: number;
}

interface DogSelectionAccordionProps {
  dogs: Dog[];
  selectedDogs: number[];
  onDogSelect: (dogId: number) => void;
}

const DogSelectionAccordion: React.FC<DogSelectionAccordionProps> = ({ dogs, selectedDogs, onDogSelect }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="relative">
      {' '}
      {/* relative 추가 */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-300 cursor-pointer">
        <div onClick={() => setShowDetails(!showDetails)}>
          <div className="flex items-center">
            <FaDog className="text-gray-400 mr-2" size={24} />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-base">함께할 강아지 선택하기</h3>
              </div>
            </div>
            <div className="text-gray-500 ml-2">{showDetails ? <AiOutlineUp /> : <AiOutlineDown />}</div>
          </div>
        </div>
      </div>
      {/* 아코디언 목록 */}
      <div
        className={`absolute left-0 right-0 bg-white border border-gray-300 mt-1 rounded-lg ${
          showDetails ? 'max-h-[110px] opacity-100 visible' : 'max-h-0 opacity-0 invisible'
        } transition-all duration-300`}
        style={{ overflow: 'auto' }}
      >
        {dogs.map((dog) => (
          <div
            key={dog.id}
            onClick={() => onDogSelect(dog.id)}
            className={`flex items-center justify-between p-3 cursor-pointer border-b last:border-b-0 ${
              selectedDogs.includes(dog.id) ? 'bg-cream-bg' : ''
            }`}
          >
            <div className="flex items-center">
              <span className="text-base">
                {dog.name} ({dog.age}세)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DogSelectionAccordion;
