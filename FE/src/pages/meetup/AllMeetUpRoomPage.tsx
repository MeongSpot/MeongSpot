import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiPlus } from 'react-icons/bi';
import { FaArrowLeft } from 'react-icons/fa';
import EveryRoomListCard from '@/components/meetUp/RoomListCard';
import RoomSortButton from '@/components/meetUp/RoomSortButton';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: string[];
  maxParticipants: number;
  currentParticipants: number;
  tags: string[];
}

const AllMeetUpRoomPage = () => {
  const [sortBy, setSortBy] = useState('latest');
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: '아침 산책 같이해요!',
      date: '2024-01-25',
      time: '08:00',
      location: '공원 입구',
      participants: ['감자', '깅깅', '보리'],
      maxParticipants: 4,
      currentParticipants: 3,
      tags: ['#아침활동', '#조용한강아지', '#소형견'],
    },
    {
      id: 2,
      title: '주말 등산 모임',
      date: '2024-01-28',
      time: '10:00',
      location: '북산 입구',
      participants: ['초코', '콩이', '뭉치', '해피'],
      maxParticipants: 6,
      currentParticipants: 4,
      tags: ['#등산', '#모험가견', '#중형견이상'],
    },
    {
      id: 3,
      title: '친구 만들기 산책',
      date: '2024-01-30',
      time: '14:00',
      location: '강변 산책로',
      participants: ['감자', '별이'],
      maxParticipants: 5,
      currentParticipants: 2,
      tags: ['#새친구환영', '#누구나참여', '#강아지친구만들기'],
    },
  ]);


  const handleSortChange = (sortType: string) => {
    setSortBy(sortType);

    const sortedEvents = [...events].sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      
      if (sortType === 'latest') {
        return dateB.getTime() - dateA.getTime(); // 최신순
      } else {
        return dateA.getTime() - dateB.getTime(); // 남은 시간순
      }
    });

    setEvents(sortedEvents);
  };

  // 채팅방으로 이동하는 함수
  const handleCardClick = (roomId: number) => {
    navigate(`/participateDog/${roomId}`);
  };

  const handlePlusClick = () => {
    navigate(`/allMeetUpRoom/create`);
  };

  return (
    <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <button className="mr-3 text-gray-600" onClick={() => navigate(-1)}>
            <FaArrowLeft size={16} />
          </button>
          <h1 className="text-lg font-bold">모임</h1>
          <BiPlus onClick={handlePlusClick} className="text-xl cursor-pointer" />
        </div>
        <hr className="my-4 -mx-4 w-screen" />
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">총 {events.length}개</span>
          <RoomSortButton sortBy={sortBy} onSortChange={handleSortChange} />
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <EveryRoomListCard key={event.id} event={event} onClick={handleCardClick} />
          ))}
        </div>
    </div>
  );
};

export default AllMeetUpRoomPage;
