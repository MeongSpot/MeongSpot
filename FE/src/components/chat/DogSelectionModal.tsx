import { motion } from 'framer-motion';
import { useDog } from '@/hooks/dog/useDog';
import { useState, useCallback, useEffect } from 'react';
import DogSelectionAccordion from '@/components/map/DogSelectionAccordion';
import { IoAddCircle } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import ErrorModal from '@/components/common/ErrorModal';
import { meetingService } from '@/services/meetingService';

interface DogSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetingId: number;
  onComplete?: () => void;
}

const DogSelectionModal = ({ isOpen, onClose, meetingId, onComplete }: DogSelectionModalProps) => {
  const navigate = useNavigate();
  const { myDogsName, getMyDogsName, isLoading } = useDog();
  const [selectedDogs, setSelectedDogs] = useState<number[]>([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorCode, setErrorCode] = useState('');
  const [hasCheckedDogs, setHasCheckedDogs] = useState(false); // 여기로 이동!

  const fetchDogs = useCallback(async () => {
    if (hasCheckedDogs) return;
    try {
      await getMyDogsName();
      setHasCheckedDogs(true);
    } catch (error) {
      console.error('강아지 목록을 불러오는데 실패했습니다:', error);
      setHasCheckedDogs(true);
    }
  }, [getMyDogsName, hasCheckedDogs]);

  useEffect(() => {
    if (isOpen && !hasCheckedDogs) {
      fetchDogs();
    }
  }, [isOpen, hasCheckedDogs, fetchDogs]);

  const handleDogSelect = (dogId: number) => {
    setSelectedDogs((prev) => (prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]));
  };

  const handleConfirm = async () => {
    try {
      await meetingService.updateMeetingDogs(meetingId, selectedDogs);
      onComplete?.(); // 성공 시 완료 콜백 호출
    } catch (error) {
      let errorCode = 'UNKNOWN';
      if (error instanceof Error) {
        errorCode = error.message;
      }
      setErrorCode(errorCode);
      setShowErrorModal(true);
    }
  };

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
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />
            <h2 className="text-lg font-bold mb-4">모임에 참여할 강아지를 선택해주세요</h2>

            <div className="flex flex-col">
              {isLoading && !hasCheckedDogs ? (
                <div className="text-center py-4">로딩 중...</div>
              ) : myDogsName.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">등록된 반려견이 없습니다</p>
                  <button
                    onClick={() => navigate('/registerdog')}
                    className="flex items-center gap-2 mx-auto bg-deep-coral text-white px-6 py-3 rounded-lg"
                  >
                    <IoAddCircle />
                    반려견 등록하기
                  </button>
                </div>
              ) : (
                <>
                  <DogSelectionAccordion dogs={myDogsName} selectedDogs={selectedDogs} onDogSelect={handleDogSelect} />

                  <div className="mt-4 flex gap-3">
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
                        selectedDogs.length === 0 ? 'bg-gray-300 text-gray-500' : 'bg-deep-coral text-white'
                      }`}
                    >
                      확인
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

export default DogSelectionModal;
