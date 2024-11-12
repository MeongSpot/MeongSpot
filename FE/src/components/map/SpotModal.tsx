// components/map/SpotModal.tsx

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import DogIcon from '/icons/DogIcon.svg';
import { FaAngleRight } from 'react-icons/fa';
import { Pagination } from 'swiper/modules';
import type { SpotModalProps } from '@/types/meetup';
import { useMeeting } from '@/hooks/meetup/useMeeting';
import 'swiper/css';
import 'swiper/css/pagination';
import MeetupCard from '@/components/map/MeetupCard';
import RoomCreateConfirmModal from '@/components/meetUp/RoomCreateConfirmModal';

const SpotModal: React.FC<SpotModalProps> = ({ isOpen, onClose, spot, onNavigateToAll }) => {
  const { meetings, isLoading, error, fetchTopMeetings } = useMeeting();
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);

  useEffect(() => {
    if (spot && isOpen) {
      fetchTopMeetings(spot.id);
    }
  }, [spot?.id, isOpen, fetchTopMeetings]);

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  if (!spot) return null;

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
          {meetings.length > 0 && (
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
          {isLoading ? (
            <div className="text-center py-4">로딩 중...</div>
          ) : error ? (
            <div className="text-center py-4 text-red-500">{error}</div>
          ) : meetings.length > 0 ? (
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
              {meetings.map((meeting) => (
                <SwiperSlide key={meeting.meetingId}>
                  <MeetupCard
                    meetup={{
                      id: meeting.meetingId,
                      title: meeting.title,
                      date: new Date(meeting.meetingAt)
                        .toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                        })
                        .replace(/\. /g, '.'),
                      time: new Date(meeting.meetingAt).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      }),
                      location: meeting.detailLocation,
                      maxParticipants: meeting.maxParticipants,
                      currentParticipants: meeting.participants,
                      tags: meeting.hashtag,
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="bg-[#F6F6F6] p-8 rounded-lg border border-gray-100 shadow-sm text-center">
              <p className="text-gray-600 mb-5">아직 등록된 모임이 없어요!</p>
              <button
                className="bg-deep-coral w-full font-bold text-lg text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
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
