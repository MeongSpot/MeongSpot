import React from 'react';
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

interface EventCardProps {
  event: Event;
  onClick: (roomId: number) => void;
}

const RoomListCard: React.FC<EventCardProps> = ({ event, onClick }) => (
  <div
    onClick={() => onClick(event.id)}
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
        <span key={index} className="text-xs text-deep-coral bg-cream-bg px-2 py-1 rounded-full">
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default RoomListCard;
