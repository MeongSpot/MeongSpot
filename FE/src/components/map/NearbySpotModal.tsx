import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { MdLocationOn } from 'react-icons/md';
import { spotService } from '@/services/spotService';
import 'swiper/css';
import 'swiper/css/pagination';
import NearbySpotCard from './NearbySpotCard';
import type { ApiSpotInfo } from '@/types/map';

interface NearbySpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPosition: { lat: number; lng: number };
  onMoveToSpot: (lat: number, lng: number, spotId: number, spotName: string) => void; // 여기 수정
}

interface EnhancedSpotInfo extends ApiSpotInfo {
  address: string;
  distance: string;
}

const SEARCH_RADIUS = 3000;

const NearbySpotModal: React.FC<NearbySpotModalProps> = ({ isOpen, onClose, currentPosition, onMoveToSpot }) => {
  const [spots, setSpots] = useState<EnhancedSpotInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNearbySpots = async () => {
      if (!isOpen) return;

      setIsLoading(true);
      setError(null);

      try {
        const spotsData = await spotService.fetchRecommendSpots(currentPosition, SEARCH_RADIUS);

        const enhancedSpotsPromises = spotsData.map(async (spot) => {
          const geocoder = new window.kakao.maps.services.Geocoder();

          const getAddressPromise = new Promise<string>((resolve) => {
            geocoder.coord2Address(spot.lng, spot.lat, (result, status) => {
              if (status === window.kakao.maps.services.Status.OK && result[0]) {
                resolve(result[0].address.address_name);
              } else {
                resolve('주소 정보 없음');
              }
            });
          });

          const address = await getAddressPromise;

          const distance = spotService.getDistance(currentPosition, { lat: spot.lat, lng: spot.lng });
          const formattedDistance = distance < 1000 ? `${Math.round(distance)}m` : `${(distance / 1000).toFixed(1)}km`;

          return {
            ...spot,
            address,
            distance: formattedDistance,
          };
        });

        const enhancedSpots = await Promise.all(enhancedSpotsPromises);
        setSpots(enhancedSpots);
      } catch (err) {
        setError('스팟 정보를 불러오는데 실패했습니다.');
        console.error('Error fetching nearby spots:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearbySpots();
  }, [isOpen, currentPosition]);

  const handleMoveToSpot = (lat: number, lng: number, spotId: number, spotName: string) => {
    onMoveToSpot(lat, lng, spotId, spotName);
    onClose();
  };

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
          {isLoading ? (
            <div className="text-center py-8">로딩 중...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : spots.length > 0 ? (
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
              {spots.map((spot) => (
                <SwiperSlide key={spot.spotId}>
                  <NearbySpotCard
                    spot={{
                      id: spot.spotId,
                      name: spot.name,
                      distance: spot.distance,
                      address: spot.address,
                      meetupCount: spot.meetingCnt,
                      lat: spot.lat,
                      lng: spot.lng,
                    }}
                    onMove={() => handleMoveToSpot(spot.lat, spot.lng, spot.spotId, spot.name)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="text-center py-8 text-gray-500">{SEARCH_RADIUS / 1000}km 이내에 멍스팟이 없습니다!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NearbySpotModal;
