import React from 'react';
import RoomCreatForm from '@/components/meetUp/RoomCreatForm';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { tr } from 'date-fns/locale';

const CreateMeetupForm = () => {
  const navigate = useNavigate();

  const backClick = () => {
    navigate(`/allmeetuproom/${placeId}`, { state: { animateBack: true } });
  };
  const { id: placeId } = useParams();

  return (
    <motion.div
      className="mx-auto p-4 bg-white rounded-lg"
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center mb-4">
        <button className="mr-3 text-gray-600" onClick={backClick}>
          <FaArrowLeft size={16} />
        </button>
        <h1 className="text-lg font-bold">산책 모임 생성하기</h1>
      </div>
      <hr className="my-4 -mx-4 w-screen" />
      <RoomCreatForm />
    </motion.div>
  );
};

export default CreateMeetupForm;
