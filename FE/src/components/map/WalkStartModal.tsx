// WalkStartModal.tsx
import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDog } from '@/hooks/dog/useDog';
import DogSelectionAccordion from './DogSelectionAccordion';
import StartWalkButton from './StartWalkButton';
import { IoAddCircle } from 'react-icons/io5';

interface WalkStartModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDogs: number[];
  onDogSelect: (dogId: number) => void;
  onStartWalk: () => void;
}

const WalkStartModal: React.FC<WalkStartModalProps> = ({ isOpen, onClose, selectedDogs, onDogSelect, onStartWalk }) => {
  const navigate = useNavigate();
  const { myDogsName, getMyDogsName, isLoading, isFetching } = useDog();
  const [hasCheckedDogs, setHasCheckedDogs] = useState(false); // 강아지 체크 여부 상태 추가

  const fetchDogs = useCallback(async () => {
    if (isFetching || hasCheckedDogs) return; // 이미 체크했거나 fetch 중이면 리턴

    try {
      const dogs = await getMyDogsName();
      setHasCheckedDogs(true);
    } catch (error) {
      console.error('강아지 목록을 불러오는데 실패했습니다:', error);
      setHasCheckedDogs(true);
    }
  }, [getMyDogsName, isFetching, hasCheckedDogs]);

  // useEffect 하나로 합치기
  useEffect(() => {
    if (isOpen && !hasCheckedDogs) {
      fetchDogs();
    }
  }, [isOpen, hasCheckedDogs, fetchDogs]);

  const getSelectedDogsText = useCallback(() => {
    const selectedDogsList = selectedDogs
      .map((id) => myDogsName.find((dog) => dog.id === id))
      .filter((dog): dog is NonNullable<typeof dog> => dog !== undefined);

    if (selectedDogsList.length === 0) return '';
    if (selectedDogsList.length <= 2) {
      return `${selectedDogsList.map((dog) => dog.name).join(', ')}(이)`;
    }
    return `${selectedDogsList[0].name} 외 ${selectedDogsList.length - 1}마리`;
  }, [selectedDogs, myDogsName]);

  const selectedDogsText = getSelectedDogsText();

  return (
    <div
      className={`absolute inset-0 z-20 bg-gray-800 bg-opacity-50 flex justify-center items-end transition-all duration-300 mb-16 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`bg-white rounded-t-lg w-full px-6 pt-6 max-w-md transform transition-all duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>

        <h2 className="text-lg font-bold mb-2">
          {selectedDogsText ? (
            <p>
              <span className="text-deep-coral font-bold">{selectedDogsText}</span>와 산책할까요?
            </p>
          ) : (
            '함께 산책할 반려견을 선택해주세요'
          )}
        </h2>

        <hr className="border-t-2 border-gray-100 " />

        <div className="flex flex-col">
          {isLoading && !hasCheckedDogs ? ( // 최초 로딩 중일 때만 로딩 표시
            <div className="text-center py-4">로딩 중...</div>
          ) : myDogsName.length === 0 ? (
            <div className="flex flex-col items-center m-6 bg-gray-200 rounded-lg justify-center py-8 space-y-4">
              <p className="text-gray-500 text-center">등록된 반려견이 없습니다</p>
              <button
                onClick={() => navigate('/registerdog')}
                className="flex items-center gap-2 bg-deep-coral text-white px-6 py-3 rounded-lg hover:bg-coral-hover transition-colors"
              >
                <IoAddCircle className="text-xl" />
                <span>반려견 등록하기</span>
              </button>
            </div>
          ) : (
            <>
              <DogSelectionAccordion dogs={myDogsName} selectedDogs={selectedDogs} onDogSelect={onDogSelect} />

              <div className="mb-3 px-4 overflow-x-auto whitespace-nowrap flex gap-2">
                {selectedDogs.map((dogId) => {
                  const dog = myDogsName.find((d) => d.id === dogId);
                  if (!dog) return null;

                  return (
                    <span
                      key={dog.id}
                      className="bg-deep-coral mt-3 text-white px-4 py-1 rounded-full text-sm flex items-center gap-3"
                    >
                      {dog.name}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDogSelect(dog.id);
                        }}
                        className="text-white hover:text-gray-500"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>

              <div className="bg-white z-10 mb-4">
                <StartWalkButton isDisabled={selectedDogs.length === 0} onClick={onStartWalk} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalkStartModal;
