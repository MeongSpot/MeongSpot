import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserFriends } from 'react-icons/fa';

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

const MeetUpPage = () => {
  const [sortBy, setSortBy] = useState('latest');
  const navigate = useNavigate();
  const [events, setEvents] =  useState<Event[]>([
    {
      id: 1,
      title: '저녁 산책 같이해요~',
      date: '2024-01-23',
      time: '19:30',
      location: '제 1주차장',
      participants: ['감자', '깅깅'],
      maxParticipants: 6,
      currentParticipants: 5,
      tags: ['#활발한_강아지_환영', '#1시간정도', '#소형견만']
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
      tags: ['#활발한_강아지_환영', '#1시간정도', '#소형견만']
    },
  ]);

  const handleSortChange = (sortType: string) => {
    setSortBy(sortType);

    const sortedEvents = [...events].sort((a, b) => {
      const dateA = new Date(`${a.date} ${a.time}`);
      const dateB = new Date(`${b.date} ${b.time}`);
      
      if (sortType === 'latest') {
        return dateB.getTime() - dateA.getTime(); // 최신순(가장 최신이 먼저)
      } else {
        return dateA.getTime() - dateB.getTime(); // 남은 시간순(가장 가까운 시간이 먼저)
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
        <div className="flex space-x-2">
          <button
            onClick={() => handleSortChange('latest')}
            className={`px-3 py-1 rounded-full ${sortBy === 'latest' ? 'bg-gray-200' : 'bg-white'} border`}
          >
            최신순
          </button>
          <button
            onClick={() => handleSortChange('oldest')}
            className={`px-3 py-1 rounded-full ${sortBy === 'oldest' ? 'bg-gray-200' : 'bg-white'} border`}
          >
            남은 시간순
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            onClick={() => handleCardClick(event.id)}
            className="bg-white p-4 rounded-lg shadow cursor-pointer"
          >
            <h2 className="text-base font-semibold">{event.title}</h2>
            <p className="text-sm text-gray-500 mt-1">
              {event.date} {event.time} | {event.location}
            </p>
            <div className="flex items-center text-sm text-gray-700 mt-2">
              <FaUserFriends className="mr-1" />
              <span>{event.currentParticipants}/{event.maxParticipants}</span>
            </div>
            
            <p className="text-sm text-gray-700 mt-2">
              {event.participants.map((name, index) => (
                <span key={index} className="mr-1">
                  {name}
                  {index < event.participants.length - 1 && ','}
                </span>
              ))}{' '}
              (이)와 함께
            </p>

            <div className="flex flex-wrap mt-2 space-x-2">
              {event.tags.map((tag, index) => (
                <span key={index} className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetUpPage;