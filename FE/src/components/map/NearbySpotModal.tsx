import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { MdLocationOn } from 'react-icons/md';
import 'swiper/css';
import 'swiper/css/pagination';
import { div } from 'framer-motion/client';
import NearbySpotCard from './NearbySpotCard';
interface NearbySpotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

//현재위치 gps 가져와서 추천 받기

const dummySpots = [
  {
    id: 1,
    name: '동락공원',
    distance: '1.9km',
    address: '경북 구미시 3공단1로 191 (진평동)',
    meetupCount: 6,
  },
  {
    id: 2,
    name: '선산공원',
    distance: '2.3km',
    address: '경북 구미시 송정대로 67 (송정동)',
    meetupCount: 4,
  },
  {
    id: 3,
    name: '금오산',
    distance: '3.1km',
    address: '경북 구미시 남통동 산1',
    meetupCount: 8,
  },
];

const NearbySpotModal: React.FC<NearbySpotModalProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`absolute inset-0 z-20 bg-gray-800 bg-opacity-50 flex justify-center items-end transition-all duration-300 mb-16 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-t-lg w-full px-6 pt-6 max-w-md transform transition-all duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6" />

        <h2 className="text-lg font-bold mb-2">
          내 주변 <span className="text-deep-coral">멍스팟</span>을 추천해 드려요!
        </h2>

        <hr className="border-t-2 border-gray-100 mb-4" />

        <div className="flex items-center space-x-2 mb-4">
          <MdLocationOn className="text-deep-coral text-xl" />
          <h3 className="text-base font-bold">지금 가장 핫한 멍스팟 추천!</h3>
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
            {dummySpots.map((spot) => (
              <SwiperSlide key={spot.id}>
                <NearbySpotCard spot={spot} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default NearbySpotModal;
