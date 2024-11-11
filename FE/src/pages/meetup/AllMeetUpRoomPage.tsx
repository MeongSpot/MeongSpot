import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { BiPlus } from 'react-icons/bi';
import { IoChevronBack } from 'react-icons/io5';
import EveryRoomListCard from '@/components/meetUp/RoomListCard';
import RoomSortButton from '@/components/meetUp/RoomSortButton';
import { AnimatePresence, motion } from 'framer-motion';
import { useMeeting } from '@/hooks/meetup/useMeeting';
import type { Meeting, MeetupEvent } from '@/types/meetup';
import LoadingOverlay from '@/components/common/LoadingOverlay';

const AllMeetUpRoomPage = () => {
  const { spotId } = useParams<{ spotId: string }>();
  const { meetings, isLoading, error, fetchMeetings } = useMeeting();
  // sortBy 초기값을 'recent'로 설정
  const [sortBy, setSortBy] = useState<'recent' | 'remain'>('recent');
  const navigate = useNavigate();
  const location = useLocation();
  const animateBack = location.state?.animateBack ?? false;
  const [showLoading, setShowLoading] = useState(false);
  // sortBy 값을 UI용으로 변환
  const uiSortBy = sortBy === 'recent' ? 'latest' : 'oldest';
  // 로딩 상태 관리
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      timer = setTimeout(() => {
        setShowLoading(true);
      }, 300); // 300ms 후에 로딩 표시
    } else {
      setShowLoading(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  useEffect(() => {
    if (spotId) {
      fetchMeetings(Number(spotId), sortBy);
    }
  }, [spotId, sortBy, fetchMeetings]);

  useEffect(() => {
    if (spotId) {
      fetchMeetings(Number(spotId), sortBy);
    }
  }, [spotId, sortBy, fetchMeetings]);

  // sortType 매핑 함수 추가
  const handleSortChange = (sortType: string) => {
    // 'latest' -> 'recent', 'oldest' -> 'remain' 매핑
    const orderType = sortType === 'latest' ? 'recent' : 'remain';
    setSortBy(orderType);
  };

  const handleCardClick = (roomId: number) => {
    navigate(`/participatedog/${roomId}`, {
      state: {
        animateBack: true,
        spotId: spotId, // spotId를 state로 전달
      },
    });
  };

  const handlePlusClick = () => {
    navigate(`/allMeetUpRoom/${spotId}/create`);
  };

  const convertToMeetupEvent = (meeting: Meeting): MeetupEvent => ({
    id: meeting.meetingId,
    title: meeting.title,
    date: new Date(meeting.meetingAt).toISOString().split('T')[0],
    time: new Date(meeting.meetingAt).toTimeString().slice(0, 5),
    location: meeting.detailLocation,
    participants: [], // API에서 참가자 목록을 제공하지 않음
    maxParticipants: meeting.maxParticipants,
    currentParticipants: meeting.participants,
    tags: meeting.hashtag,
  });

  return (
    <AnimatePresence>
      <motion.div
        className="p-4"
        initial={{ x: animateBack ? -300 : 0, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: animateBack ? 300 : 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between mb-4">
          <button className="mr-3 text-gray-600" onClick={() => navigate('/meeting', { state: { animateBack: true } })}>
            <IoChevronBack size={24} />
          </button>
          <h1 className="text-lg font-bold">모임</h1>
          <BiPlus onClick={handlePlusClick} className="text-xl cursor-pointer" />
        </div>
        <hr className="my-4 -mx-4 w-screen" />

        {showLoading ? (
          <LoadingOverlay message="모임을 불러오는 중입니다..." />
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">총 {meetings.length}개</span>
              <RoomSortButton sortBy={uiSortBy} onSortChange={handleSortChange} />
            </div>
            <div className="space-y-4">
              {meetings.map((meeting) => (
                <EveryRoomListCard
                  key={meeting.meetingId}
                  event={convertToMeetupEvent(meeting)}
                  onClick={() => handleCardClick(meeting.meetingId)}
                />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AllMeetUpRoomPage;
