import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MyRoomListCard from '@/components/meetUp/RoomListCard';
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

const MyMeetUpRoomPage = () => {
  const [sortBy, setSortBy] = useState('latest');
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: '저녁 산책 같이해요~',
      date: '2024-01-23',
      time: '19:30',
      location: '제 1주차장',
      participants: ['감자', '깅깅'],
      maxParticipants: 6,
      currentParticipants: 5,
      tags: ['#강아지_친구_모집', '#1시간정도', '#소형견만']
    },
    {
      id: 2,
      title: '저녁 산책 같이해요~',
      date: '2024-01-22',
      time: '04:30',
      location: '제 2주차장',
      participants: ['감자', '깅깅', '오리미'],
      maxParticipants: 6,
      currentParticipants: 5,
      tags: ['#활발한_강아지_환영', '#2시간정도', '#대형견만']
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
    navigate(`/chat/group/${roomId}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-center text-lg font-bold mb-4">모임</h1>
      <hr className="my-4" />
      <div className="flex justify-between items-center mb-4">
        <span className="text-gray-600">총 {events.length}개</span>
        <RoomSortButton sortBy={sortBy} onSortChange={handleSortChange} />
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <MyRoomListCard key={event.id} event={event} onClick={handleCardClick} />
        ))}
      </div>
    </div>
  );
};

export default MyMeetUpRoomPage;
