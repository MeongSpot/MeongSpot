import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaUserFriends } from 'react-icons/fa';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import ChatOptionModal from '@/components/chat/ChatOptionModal';

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

const RoomListCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedChatName, setSelectedChatName] = useState('');
  const location = useLocation();

  const openModal = (chatName: string) => {
    setSelectedChatName(chatName);
    setIsModalVisible(true)
    setTimeout(() => setIsModalOpen(true), 10);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChatName('');
  };

  useEffect(() => {
    if (!isModalOpen) {
      const timer = setTimeout(() => setIsModalVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isModalOpen]);

  return (
    <div onClick={() => onClick(event.id)} className="bg-white p-4 rounded-lg shadow cursor-pointer">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">{event.title}</h2>
        {location.pathname.includes('/myMeetUpRoom') && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal(event.title);
            }}
            className="text-gray-500 z-10"
          >
            <BiDotsVerticalRounded size={24} />
          </button>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-1">
        {event.date} {event.time} | {event.location}
      </p>
      <div className="flex items-center text-sm text-gray-700 mt-2">
        <FaUserFriends className="mr-1" />
        <span>
          {event.currentParticipants}/{event.maxParticipants}
        </span>
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
      {isModalVisible && (
        <ChatOptionModal isOpen={isModalOpen} onClose={closeModal} chatName={selectedChatName} />
      )}
    </div>
  );
};

export default RoomListCard;
