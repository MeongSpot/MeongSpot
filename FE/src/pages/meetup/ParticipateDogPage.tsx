import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';
import { motion } from 'framer-motion';

interface EventData {
  title: string;
  memberCount: string;
  description: string;
  tags: string[];
  date: string;
  time: string;
  location: string;
  participants: { id: number; name: string; breed: string }[];
}

const ParticipateDogPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const animateBack = location.state?.animateBack ?? true;

  const [eventData] = useState<EventData>({
    title: '저녁 산책 같이해요~',
    memberCount: '5 / 6 명',
    description: '활발한 강아지들 환영해요! 매너 있는 견주 분이셨으면 좋겠어요. 즐겁게 소형견 산책 모임해요 ☺️',
    tags: ['활발한_강아지_환영', '1시간정도', '소형견만'],
    date: '2024-10-24',
    time: '오후 7시 30분',
    location: '제 1주차장',
    participants: [
      { id: 1, name: '뽀삐', breed: '말티즈' },
      { id: 2, name: '두부', breed: '치와와' },
      { id: 3, name: '깜자', breed: '코카스파니엘' },
      { id: 4, name: '카트시', breed: '스피츠' },
      { id: 5, name: '꺼양', breed: '포메라니안' },
    ],
  });

  const handleJoinClick = () => {
    navigate(`/chat/group/${roomId}`, { state: { animateBack: true } });
  };

  const handleBack = () => {
    navigate(`/allmeetuproom/${roomId}`, { state: { animateBack: true } });
  };

  return (
    <motion.div
      initial={{ x: animateBack ? 300 : 0, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: animateBack ? -300 : 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex flex-col h-screen bg-gray-100"
    >
      <div className="flex items-center bg-deep-coral text-white p-4">
        <button onClick={handleBack} className="mr-3">
          <IoChevronBack size={24} />
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">참여 강아지</h1>
      </div>

      <div className="p-4 bg-white flex-1 overflow-auto">
        <div className="p-4">
          <h2 className="text-2xl font-semibold">{eventData.title}</h2>
          <p className="text-gray-500">멤버 {eventData.memberCount}</p>
        </div>

        <div className="p-4">
          <p className="text-gray-700 mb-4">{eventData.description}</p>
          <div className="flex flex-wrap gap-2">
            {eventData.tags.map((tag, index) => (
              <span key={index} className="text-xs text-deep-coral bg-orange-100 px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center mb-2">
            <FaCalendarAlt className="text-gray-500 mr-2" />
            <span className="font-medium">날짜</span>
            <span className="ml-auto text-gray-600">{eventData.date}</span>
          </div>
          <div className="flex items-center mb-2">
            <FaClock className="text-gray-500 mr-2" />
            <span className="font-medium">시간</span>
            <span className="ml-auto text-gray-600">{eventData.time}</span>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-gray-500 mr-2" />
            <span className="font-medium">상세 장소</span>
            <span className="ml-auto text-gray-600">{eventData.location}</span>
          </div>
        </div>

        <div className="border-t border-gray-200 p-4">
          <h3 className="font-semibold mb-2">
            참여 강아지 <span className="text-deep-coral">{eventData.participants.length}</span>
          </h3>
          <div className="space-y-2">
            {eventData.participants.map((participant) => (
              <div key={participant.id} className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 mr-3"></div>
                <span className="flex-1">{participant.name}</span>
                <span className="text-gray-500">{participant.breed}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div onClick={handleJoinClick} className="p-2 bg-deep-coral">
        <button className="w-full text-white py-2 rounded-lg font-bold">모임 가입</button>
      </div>
    </motion.div>
  );
};

export default ParticipateDogPage;
