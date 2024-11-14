import React, { useEffect, useCallback, useState } from 'react';
import { useDog } from '@/hooks/dog/useDog';
import { meetingService } from '@/services/meetingService';
import DogSelectionAccordion from '@/components/map/DogSelectionAccordion';
import { motion } from 'framer-motion';
import ErrorModal from '@/components/common/ErrorModal';

interface MeetingDataType {
  title: string;
  meetingAt: string;
  maxParticipants: number;
  participants: number;
  information?: string;
  detailLocation?: string;
}

interface JoinConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  meetingData?: MeetingDataType;
  selectedDogs: number[];
  onDogSelect: (dogId: number) => void;
  meetingId: string;
}

const JoinConfirmationModal: React.FC<JoinConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  meetingData,
  selectedDogs,
  onDogSelect,
  meetingId,
}) => {
  const { myDogsName, getMyDogsName, isLoading } = useDog();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorCode, setErrorCode] = useState('');

  const fetchDogs = useCallback(async () => {
    try {
      await getMyDogsName();
    } catch (error) {
      console.error('강아지 목록을 불러오는데 실패했습니다:', error);
    }
  }, [getMyDogsName]);

  useEffect(() => {
    if (isOpen && myDogsName.length === 0) {
      fetchDogs();
    }
  }, [isOpen, myDogsName.length, fetchDogs]);

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

  const handleConfirm = async () => {
    try {
      await meetingService.joinMeeting(meetingId, selectedDogs);
      onConfirm(); // 성공 시 상위 컴포넌트의 onConfirm 호출 (JoinSuccessModal 표시)
    } catch (error) {
      let errorCode = 'UNKNOWN';
      if (error instanceof Error) {
        errorCode = error.message;
      }
      setErrorCode(errorCode);
      setShowErrorModal(true);
    }
  };

  const selectedDogsText = getSelectedDogsText();

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        className="absolute inset-0 z-50 bg-black/50 flex items-end justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white w-full max-w-md rounded-t-2xl"
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            {/* Handle Bar */}
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

            {/* Title */}
            <h2 className="text-lg font-bold mb-4">
              {selectedDogsText ? (
                <p>
                  <span className="text-deep-coral font-bold">{selectedDogsText}</span>와 함께하시겠어요?
                </p>
              ) : (
                <p>
                  모임에 함께할 <span className="text-deep-coral font-bold">반려견</span>을 선택해주세요
                </p>
              )}
            </h2>

            <hr className="border-t-2 border-gray-100 mb-4" />

            {/* Meeting Info Summary */}
            <div className="flex items-center space-x-2 mb-4">
              <h3 className="text-base font-bold">참여할 강아지를 선택해주세요!</h3>
            </div>

            <div className="flex flex-col">
              {isLoading ? (
                <div className="text-center py-4">로딩 중...</div>
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

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={onClose}
                      className="flex-1 py-3 px-4 rounded-lg border border-gray-300 font-semibold"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleConfirm}
                      disabled={selectedDogs.length === 0}
                      className={`flex-1 py-3 px-4 rounded-lg font-semibold ${
                        selectedDogs.length === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-deep-coral text-white'
                      }`}
                    >
                      참여하기
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      <ErrorModal isOpen={showErrorModal} onClose={() => setShowErrorModal(false)} errorCode={errorCode} />
    </>
  );
};

export default JoinConfirmationModal;
