import React from 'react';
import DogCard from '@/components/meetUp/DogListCard';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import { motion } from 'framer-motion';

const MeetUpDogListPage = () => {
  const dogs = [
    {
      id: 1,
      name: '뽀삐',
      breed: '말티즈',
      birthdate: '',
      age: 0,
      personalityTags: [],
    },
    {
      id: 2,
      name: '두부',
      breed: '치와와',
      birthdate: '',
      age: 0,
      personalityTags: [],
    },
    {
      id: 3,
      name: '감자',
      breed: '코카스파니엘',
      birthdate: '2019-10-11',
      age: 7,
      personalityTags: ['새로운 친구 만나는 걸 좋아해요', '조금 활발해요', '호기심이 많아요'],
    },
    {
      id: 4,
      name: '카토시',
      breed: '스피츠',
      birthdate: '',
      age: 0,
      personalityTags: [],
    },
    {
      id: 5,
      name: '꺼양',
      breed: '포메라니안',
      birthdate: '',
      age: 0,
      personalityTags: [],
    },
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const animateBack = location.state?.animateBack ?? true;
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <motion.div
      className="flex flex-col h-screen"
      initial={{ x: animateBack ? 300 : 0, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: animateBack ? -300 : 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center bg-deep-coral text-white p-4">
        <button onClick={handleBack} className="mr-3">
          <IoChevronBack size={24} />
        </button>
        <h1 className="text-lg font-bold">저녁 산책 같이해요~</h1>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">참여 강아지 {dogs.length}</h2>
        {dogs.map((dog) => (
          <DogCard key={dog.id} dog={dog} />
        ))}
      </div>
    </motion.div>
  );
};

export default MeetUpDogListPage;
