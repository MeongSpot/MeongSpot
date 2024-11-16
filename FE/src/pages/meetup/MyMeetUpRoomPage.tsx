import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import MyRoomListCard from '@/components/meetUp/MyRoomListCard';
import OrderSortButton from '@/components/meetUp/OrderSortButton';
import { useMyMeeting } from '@/hooks/meetup/useMyMeeting';
import MascotDog from '@/components/common/Logo/Mascot'; // MascotDog import 추가

const MyMeetUpRoomPage = () => {
  const { meetings, loading, error } = useMyMeeting();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();
  const location = useLocation();

  const handleDirectionChange = (direction: 'asc' | 'desc') => {
    setSortDirection(direction);
  };

  const sortedMeetings = [...meetings].sort((a, b) => {
    const dateA = new Date(a.meetingAt).getTime();
    const dateB = new Date(b.meetingAt).getTime();
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return (
    <AnimatePresence>
      <motion.div
        // initial={{ x: location.state?.animateBack ? 300 : -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: location.state?.animateBack ? 300 : -300, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="min-h-screen bg-white"
      >
        {/* 고정된 헤더 부분 */}
        <div className="sticky top-0 bg-white">
          <div className="flex items-center justify-center border-b p-4">
            <h1 className="text-lg font-bold">모임</h1>
          </div>
          <div className="w-full flex justify-between items-center py-3 px-5 pb-3">
            <span className="text-gray-600">총 {meetings.length}개</span>
            <OrderSortButton direction={sortDirection} onDirectionChange={handleDirectionChange} />
          </div>
        </div>

        {/* 스크롤되는 컨텐츠 부분 */}
        {error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <div className="px-4">
            {meetings.length > 0 ? (
              <div className="space-y-4">
                {sortedMeetings.map((meeting) => (
                  <MyRoomListCard key={meeting.meetingId} meeting={meeting} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mt-[20vh]">
                <div className="flex flex-col justify-center items-center h-64 text-gray-500">
                  <div className="rounded-full bg-gray-200 p-4 mb-4">
                    <MascotDog className="w-16 h-16 grayscale" />
                  </div>
                  <p className="text-sm mb-2">참여 중인 모임이 없습니다</p>
                  <p className="text-xs text-deep-coral">새로운 모임에 참여해보세요!</p>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default MyMeetUpRoomPage;
