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
    <div className="bg-white p-4 rounded-lg shadow border border-gray-300 cursor-pointer">
      <div onClick={() => setShowDetails(!showDetails)}>
        <div className="flex items-center mb-2">
          <FaDog className="text-gray-400 mr-2" size={24} />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base">함께할 강아지 선택하기</h3>
            </div>
          </div>
          <div className="text-gray-500 ml-2">{showDetails ? <AiOutlineUp /> : <AiOutlineDown />}</div>
        </div>
      </div>

      {/* 아코디언이 열리면 버튼을 덮도록 설정 */}
      <div
        className={`transition-[max-height,opacity] duration-300 ease-in-out ${
          showDetails ? 'max-h-[250px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ overflow: 'hidden' }}
      >
        <div className="overflow-y-auto max-h-[250px]">
          {dogs.map((dog) => (
            <div
              key={dog.id}
              onClick={() => onDogSelect(dog.id)}
              className={`flex items-center justify-between p-2 cursor-pointer hover:bg-gray-50 
                ${selectedDogs.includes(dog.id) ? 'bg-cream-bg' : ''}`}
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
    </div>
  );
};

export default DogSelectionAccordion;
