import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import DogIcon from '/icons/DogIcon.svg';
import { FaUserFriends, FaAngleRight } from 'react-icons/fa';
import { Pagination } from 'swiper/modules';
import type { SpotModalProps } from '@/types/meetup';
import 'swiper/css';
import 'swiper/css/pagination';

const SpotModal: React.FC<SpotModalProps> = ({ isOpen, onClose, spot, onNavigateToAll }) => {
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
          <span className="text-deep-coral font-bold">{spot.content}</span>에서 같이 산책할래요?
        </h2>

        <hr className="border-t-2 border-gray-100 mb-4" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <img src={DogIcon} alt="Dog Icon" className="w-5 h-5" />
            <h3 className="text-base font-bold">참여 가능한 산책 모임</h3>
          </div>
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
        </div>

        <div className="px-4 pb-6">
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
            {spot.meetups.map((meetup) => (
              <SwiperSlide key={meetup.id}>
                <div className="bg-[#F6F6F6] p-4 rounded-lg border border-gray-100 shadow-sm">
                  <h3 className="text-base font-semibold">{meetup.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {meetup.date} {meetup.time} | {meetup.location}
                  </p>
                  <div className="flex items-center text-sm text-gray-700 mt-2">
                    <FaUserFriends className="mr-1" />
                    <span>
                      {meetup.currentParticipants}/{meetup.maxParticipants}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    {meetup.participants.map((name, index) => (
                      <span key={index}>
                        {name}
                        {index < meetup.participants.length - 1 && ', '}
                      </span>
                    ))}
                    (이)와 함께
                  </p>
                  <div className="flex flex-wrap mt-2 gap-2">
                    {meetup.tags.map((tag, index) => (
                      <span key={index} className="text-xs text-deep-coral bg-white border px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default SpotModal;
