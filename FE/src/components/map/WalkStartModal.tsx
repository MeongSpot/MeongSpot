import React from 'react';
import DogSelectionAccordion from './DogSelectionAccordion';
import StartWalkButton from './StartWalkButton';

interface WalkStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDogs: number[];
  onDogSelect: (dogId: number) => void;
  onStartWalk: () => void;
}

const WalkStartModal: React.FC<WalkStartModalProps> = ({ isOpen, onClose, selectedDogs, onDogSelect, onStartWalk }) => {
  const dogList = [
    { id: 1, name: '뽀삐', age: 3 },
    { id: 2, name: '쿠키', age: 5 },
    { id: 3, name: '몽이', age: 2 },
    { id: 4, name: '초코', age: 4 },
    { id: 5, name: '루비', age: 1 },
  ];

  const selectedDogNames = dogList
    .filter((dog) => selectedDogs.includes(dog.id))
    .map((dog) => dog.name)
    .join(', ');

  return (
    <div
      className={`fixed inset-0 z-20 bg-gray-800 bg-opacity-50 flex justify-center items-end transition-all duration-300 mb-16 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`bg-white rounded-t-lg w-full px-6 pt-6 max-w-md transform transition-all duration-300 relative ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>

        <h2 className="text-lg font-bold mb-2">
          {selectedDogNames ? (
            <>
              <span className="text-deep-coral font-bold">{selectedDogNames}</span>(이)와 같이 산책할까요?
            </>
          ) : (
            '함께 산책할 반려견을 선택해주세요'
          )}
        </h2>

        <hr className="border-t-2 border-gray-100 mb-4" />

        {/* 아코디언이 버튼 위로 덮이도록 설정 */}
        <div className="relative h-40 w-full mb-4">
          <div className="absolute bottom-24 left-0 w-full">
            <DogSelectionAccordion dogs={dogList} selectedDogs={selectedDogs} onDogSelect={onDogSelect} />
          </div>
          <div className="absolute bottom-0 left-0 w-full">
            <StartWalkButton isDisabled={selectedDogs.length === 0} onClick={onStartWalk} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalkStartModal;
