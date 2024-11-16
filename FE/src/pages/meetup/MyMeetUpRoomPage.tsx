import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import MyRoomListCard from '@/components/meetUp/MyRoomListCard';
import OrderSortButton from '@/components/meetUp/OrderSortButton';
import { useMyMeeting } from '@/hooks/meetup/useMyMeeting';

const MyMeetUpRoomPage = () => {
  const { meetings, loading, error } = useMyMeeting();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const navigate = useNavigate();
  const location = useLocation();

  const handleDirectionChange = (direction: 'asc' | 'desc') => {
    setSortDirection(direction);
  };

  const renderContent = () => {
    const sortedMeetings = [...meetings].sort((a, b) => {
      const dateA = new Date(a.meetingAt).getTime();
      const dateB = new Date(b.meetingAt).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    });
  
    return (
      <div className="p-4 pb-20">
        <h1 className="text-center text-lg font-bold mb-4">모임</h1>
        <hr className="my-4 -mx-4 w-screen" />
        {error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">총 {meetings.length}개</span>
              <OrderSortButton direction={sortDirection} onDirectionChange={handleDirectionChange} />
            </div>
            <div className="space-y-4">
              {sortedMeetings.map((meeting) => (
                <MyRoomListCard key={meeting.meetingId} meeting={meeting} />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: location.state?.animateBack ? 300 : -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: location.state?.animateBack ? 300 : -300, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="min-h-screen bg-white"
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
};

export default MyMeetUpRoomPage;
