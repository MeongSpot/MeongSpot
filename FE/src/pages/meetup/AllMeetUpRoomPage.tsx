import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { BiPlus } from 'react-icons/bi';
import { IoChevronBack } from 'react-icons/io5';
import AllRoomListCard from '@/components/meetUp/AllRoomListCard';
import RoomSortButton from '@/components/meetUp/RoomSortButton';
import { AnimatePresence, motion } from 'framer-motion';
import { useMeeting } from '@/hooks/meetup/useMeeting';
import type { Meeting, MeetupEvent } from '@/types/meetup';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import MascotDog from '@/components/common/Logo/Mascot';

const AllMeetUpRoomPage = () => {
  const { spotId } = useParams<{ spotId: string }>();
  const { meetings, isLoading, error, fetchMeetings } = useMeeting();
  const [sortBy, setSortBy] = useState<'recent' | 'remain'>('recent');
  const navigate = useNavigate();
  const location = useLocation();
  const animateBack = location.state?.animateBack ?? false;
  const spotName = location.state?.spotName;
  const [showLoading, setShowLoading] = useState(false);
  const uiSortBy = sortBy === 'recent' ? 'latest' : 'oldest';
  const fromDetail = location.state?.fromDetail;

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
        spotId: spotId, // spotId를 state로 전달
        spotName: spotName, // 현재 페이지가 가지고 있는 spotName을 전달
        fromList: true,
        previousPath: location.pathname,
      },
    });
  };

  const handlePlusClick = () => {
    navigate(`/allmeetuproom/${spotId}/create`, {
      state: {
        spotName: spotName, // 현재 페이지가 가지고 있는 spotName을 전달
      },
    });
  };

  const convertToMeetupEvent = (meeting: Meeting): MeetupEvent => ({
    id: meeting.meetingId,
    title: meeting.title,
    date: new Date(meeting.meetingAt).toISOString().split('T')[0],
    time: new Date(meeting.meetingAt).toTimeString().slice(0, 5),
    location: meeting.detailLocation,
    maxParticipants: meeting.maxParticipants,
    currentParticipants: meeting.participants,
    tags: meeting.hashtag,
  });

  // 애니메이션 설정을 위한 변수
  const pageAnimation = fromDetail
    ? {
        initial: { x: animateBack ? -300 : 0 },
        animate: { x: 0 },
        exit: { x: animateBack ? 300 : 0 },
      }
    : {
        initial: { x: animateBack ? -300 : 0 },
        animate: { x: 0 },
        exit: { x: animateBack ? 300 : 0 },
      };

  return (
    <AnimatePresence>
      <motion.div {...pageAnimation} transition={{ type: 'spring', stiffness: 300, damping: 35 }}>
        <div className="sticky top-0 flex items-center justify-between mb-4 border-b p-4 bg-white">
          <button className="mr-3 text-gray-600" onClick={() => navigate('/meeting', { state: { animateBack: true } })}>
            <IoChevronBack size={24} />
          </button>
          <h1 className="text-lg font-bold">
            {spotName ? <span className="text-deep-coral">{spotName}</span> : '모임'}
          </h1>
          <BiPlus onClick={handlePlusClick} className="text-xl cursor-pointer" />
        </div>

        {showLoading ? (
          <LoadingOverlay message="모임을 불러오는 중입니다..." />
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <div className="">
            <div className="sticky w-full top-20 flex justify-between items-center my-2 px-5 pb-3 bg-white">
              <span className="text-gray-600">총 {meetings.length}개</span>
              <RoomSortButton sortBy={uiSortBy} onSortChange={handleSortChange} />
            </div>
            {meetings.length > 0 ? (
              <div className="space-y-4 px-4 ">
                {meetings.map((meeting) => (
                  <AllRoomListCard
                    key={meeting.meetingId}
                    event={convertToMeetupEvent(meeting)}
                    onClick={() => handleCardClick(meeting.meetingId)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center mt-[20vh]">
                <div className="flex flex-col justify-center items-center h-64 text-gray-500">
                  <div className="rounded-full bg-gray-200 p-4 mb-4">
                    <MascotDog className="w-16 h-16 grayscale" />
                  </div>
                  <p className="text-sm mb-2">{spotName ? `${spotName}에` : ''} 등록된 모임이 없습니다</p>
                  <p className="text-xs text-deep-coral">새로운 모임을 만들어보세요!</p>
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AllMeetUpRoomPage;
