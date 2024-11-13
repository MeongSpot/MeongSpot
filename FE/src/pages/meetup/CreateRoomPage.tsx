import React from 'react';
import RoomCreatForm from '@/components/meetUp/RoomCreatForm';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { tr } from 'date-fns/locale';

const CreateMeetupForm = () => {
  const navigate = useNavigate();
  const { id: placeId } = useParams();
  const location = useLocation();
  const spotName = location.state?.spotName;

  const backClick = () => {
    navigate(`/allmeetuproom/${placeId}`, {
      state: {
        animateBack: true,
        spotName: spotName, // 뒤로 가기할 때도 spotName 유지
      },
    });
  };
  return (
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
      <div className="pt-4 ">
        <RoomCreatForm />
      </div>
    </motion.div>
  );
};

export default CreateMeetupForm;
