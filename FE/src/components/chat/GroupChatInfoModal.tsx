import React, { useState } from 'react';
import { FiArrowRight, FiBellOff, FiCalendar, FiClock, FiMapPin, FiSettings, FiLogOut } from 'react-icons/fi';
import { FaBell } from 'react-icons/fa';

interface GroupChatInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: () => void;
}

const GroupChatInfoModal: React.FC<GroupChatInfoModalProps> = ({ isOpen, onClose, onViewDetails }) => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const toggleNotification = () => {
    setIsNotificationEnabled((prev) => !prev);
    // 나중에 여기다가 알림 서버요청 추가
  };
  return (
    <div
      className={`fixed inset-0 z-20 bg-gray-800 bg-opacity-50 flex justify-end transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`transform transition-transform duration-300 ease-in-out bg-white w-4/5 max-w-md h-full p-6 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center">
            <button onClick={toggleNotification} className="mr-2">
              {isNotificationEnabled ? <FaBell /> : <FiBellOff />}
            </button>
            채팅 푸시 알림
          </h2>
          <button onClick={onClose} className="text-gray-500">
            <FiArrowRight size={24} />
          </button>
        </div>

        <hr className="my-2" />

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <FiCalendar size={18} className="text-gray-500 mr-2" />
            <span className="flex-1">날짜</span>
            <span className="text-gray-800">2024-10-24</span>
          </div>
          <div className="flex items-center mb-2">
            <FiClock size={18} className="text-gray-500 mr-2" />
            <span className="flex-1">시간</span>
            <span className="text-gray-800">오후 7시 30분</span>
          </div>
          <div className="flex items-center mb-2">
            <FiMapPin size={18} className="text-gray-500 mr-2" />
            <span className="flex-1">상세 장소</span>
            <span className="text-gray-800">제 1주차장</span>
          </div>
        </div>

        <hr className="my-2" />

        <div className="mb-4">
          <h3 className="text-gray-700 mb-2">해시태그</h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-cream-bg text-orange-600 px-2 py-1 rounded-full text-sm"># 활발한_강아지_환영</span>
            <span className="bg-cream-bg text-orange-600 px-2 py-1 rounded-full text-sm"># 1시간정도</span>
            <span className="bg-cream-bg text-orange-600 px-2 py-1 rounded-full text-sm"># 소형견만</span>
          </div>
        </div>

        <hr className="my-2" />

        <div className="mb-4">
          <h3 className="text-gray-700 mb-2">모임설명</h3>
          <p className="text-gray-600 text-sm">
            활발한 강아지들 환영해요! 매너 있는 친구 타임이었으면 좋겠어요. 즐겁게 소형견 산책 모임해요 😊
          </p>
        </div>

        <hr className="my-2" />

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <h3 className="text-gray-700">참여 강아지</h3>
              <span className="text-gray-800 font-semibold">5</span>
              <span className="text-gray-500">/ 6</span>
            </div>
            <button onClick={onViewDetails} className="text-sm text-gray-700">
              상세보기
            </button>
          </div>

          <div className="flex space-x-2 mt-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="w-8 h-8 bg-gray-300 rounded-full"></div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full flex justify-between items-center border-t">
          <button className="flex-1 py-4 flex justify-center items-center space-x-2 text-gray-600 hover:text-gray-800">
            <FiSettings size={20} />
            <span>모임 설정</span>
          </button>
          <div className="w-px h-6 bg-gray-300"></div> {/* Divider */}
          <button className="flex-1 py-4 flex justify-center items-center space-x-2 text-gray-600 hover:text-gray-800">
            <FiLogOut size={20} />
            <span>나가기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatInfoModal;
