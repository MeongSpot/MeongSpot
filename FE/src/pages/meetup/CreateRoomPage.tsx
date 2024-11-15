import React, { useCallback, useEffect, useState } from 'react';
import RoomCreatForm from '@/components/meetUp/RoomCreatForm';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import NoDogModal from '@/components/meetUp/NoDogModal';
import { useDog } from '@/hooks/dog/useDog';
import { DogName } from '@/types/dogInfo';

const CreateMeetupForm = () => {
  const navigate = useNavigate();
  const { id: placeId } = useParams();
  const location = useLocation();
  const spotName = location.state?.spotName;
  const [showNoDogModal, setShowNoDogModal] = useState(false);
  const { myDogsName, getMyDogsName, isLoading } = useDog();
  const [hasCheckedDogs, setHasCheckedDogs] = useState(false);

  const [dogs, setDogs] = useState<DogName[]>([]);

  const fetchDogs = useCallback(async () => {
    if (hasCheckedDogs) return;

    try {
      const fetchedDogs = await getMyDogsName();
      console.log('Fetched dogs:', fetchedDogs);

      // 모달 상태를 먼저 설정
      if (!fetchedDogs || fetchedDogs.length === 0) {
        setShowNoDogModal(true);
      } else {
        setShowNoDogModal(false); // 강아지가 있으면 모달 닫기 추가
      }

      setDogs(fetchedDogs || []);
      setHasCheckedDogs(true);
    } catch (error) {
      console.error('강아지 목록 가져오기 실패:', error);
      setShowNoDogModal(true); // 에러 시에도 모달 표시
      setHasCheckedDogs(true);
    }
  }, [hasCheckedDogs, getMyDogsName]);

  useEffect(() => {
    fetchDogs();
  }, [fetchDogs]);

  const handleRegisterDog = () => {
    navigate('/registerdog');
  };

  const backClick = () => {
    navigate(`/allmeetuproom/${placeId}`, {
      state: {
        animateBack: true,
        spotName: spotName,
      },
    });
  };

  return (
    <>
      <motion.div
        className="mx-auto max-w-2xl bg-white min-h-screen"
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="px-4 py-4">
            <div className="flex items-center">
              <button className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors" onClick={backClick}>
                <FaArrowLeft size={16} className="text-gray-600" />
              </button>
              <h1 className="text-lg font-bold">
                {spotName ? (
                  <>
                    <span className="text-deep-coral">{spotName}</span>
                    {' 산책 모임 생성하기'}
                  </>
                ) : (
                  '산책 모임 생성하기'
                )}
              </h1>
            </div>
          </div>
        </div>
        <div className="pt-4">
          {/* hasCheckedDogs가 true이고 강아지가 있을 때만 RoomCreatForm 렌더링 */}
          <RoomCreatForm initialDogs={dogs} />
        </div>
      </motion.div>

      <NoDogModal
        isOpen={showNoDogModal}
        onClose={() => {
          setShowNoDogModal(false);
          backClick();
        }}
        onConfirm={handleRegisterDog}
      />
    </>
  );
};

export default CreateMeetupForm;
