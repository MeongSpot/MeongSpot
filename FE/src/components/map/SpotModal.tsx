import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import DogIcon from '/icons/DogIcon.svg';
import { FaUserFriends, FaAngleRight, FaEllipsisH } from 'react-icons/fa';
import { Pagination } from 'swiper/modules';
import type { SpotModalProps } from '@/types/meetup';
import 'swiper/css';
import 'swiper/css/pagination';
import MeetupCard from '@/components/map/MeetupCard';
import RoomCreateConfirmModal from '@/components/meetUp/RoomCreateConfirmModal';

const DUMMY_MEETUPS = {
  // 찰밭공원의 모임 데이터
  14421: [
    {
      id: 1,
      title: '찰밭공원에서 강아지 산책해요',
      date: '2024.03.15',
      time: '오후 3:00',
      location: '찰밭공원 중앙 광장',
      participants: ['멍멍이맘', '댕댕이파파', '바둑이언니'],
      maxParticipants: 5,
      currentParticipants: 3,
      tags: ['소형견', '중형견', '친목', '산책', '초보환영', '정기모임'],
    },
    {
      id: 2,
      title: '저녁 산책 함께해요',
      date: '2024.03.16',
      time: '오후 7:00',
      location: '찰밭공원 입구',
      participants: ['해피도그', '럭키맘'],
      maxParticipants: 4,
      currentParticipants: 2,
      tags: ['대형견', '야간산책', '장기모임'],
    },
  ],
  // 동그라미공원은 모임 없음
  14420: [],
};

// SpotModal 컴포넌트 수정
const SpotModal: React.FC<SpotModalProps> = ({ isOpen, onClose, spot, onNavigateToAll }) => {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);

  if (!spot) return null;

  // spotId에 따른 모임 데이터 가져오기
  const meetups = DUMMY_MEETUPS[spot.id as keyof typeof DUMMY_MEETUPS] || [];

  return (
    <div
      className={`fixed inset-0 z-20 bg-gray-800 bg-opacity-50 flex justify-center items-end transition-all duration-300 mb-16 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleBackgroundClick}
    >
      <div
        className={`bg-white rounded-t-lg w-full px-6 pt-6 max-w-md transform transition-all duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>

        <h2 className="text-lg font-bold mb-2">
          <span className="text-deep-coral font-bold truncate">{spot.content}</span>에서 같이 산책할래요?
        </h2>

        <hr className="border-t-2 border-gray-100 mb-4" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <img src={DogIcon} alt="Dog Icon" className="w-5 h-5" />
            <h3 className="text-base font-bold">참여 가능한 산책 모임</h3>
          </div>
          {meetups.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToAll();
              }}
              className="flex items-center text-gray-500 hover:text-deep-coral transition-colors"
            >
              <span className="text-sm mr-1">모두보기</span>
              <FaAngleRight className="text-lg" />
            </button>
          )}
        </div>

        <div className="px-4 pb-6">
          {meetups.length > 0 ? (
            <Swiper
              modules={[Pagination]}
              slidesPerView={1.2}
              spaceBetween={16}
              pagination={{
                clickable: true,
                el: '.meetup-swiper-pagination',
              }}
              className="meetupSwiper"
            >
              {meetups.map((meetup) => (
                <SwiperSlide key={meetup.id}>
                  <MeetupCard meetup={meetup} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            // 모임이 없을 때 보여줄 카드
            <div className="bg-[#F6F6F6] p-6 rounded-lg border border-gray-100 shadow-sm text-center">
              <p className="text-gray-600 mb-4">아직 등록된 모임이 없어요!</p>
              <button
                className="bg-deep-coral text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-colors"
                onClick={() => setShowCreateConfirm(true)}
              >
                새로운 모임 만들기
              </button>
            </div>
          )}
        </div>
      </div>
      <RoomCreateConfirmModal
        isOpen={showCreateConfirm}
        onClose={() => setShowCreateConfirm(false)}
        spotName={spot.content}
        spotId={spot.id}
      />
    </div>
  );
};

export default SpotModal;
