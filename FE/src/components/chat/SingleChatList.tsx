import React, { useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import ChatOptionsModal from './ChatOptionModal';
import useFetchSingleChatRooms from '@/hooks/chat/useFetchSingleChatRooms';
import { format, isToday, isYesterday } from 'date-fns';

const SingleChatList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<{ name: string; profileImage: string, chatRoomId: number } | null>(null);
  const navigate = useNavigate();

  const { chatRooms, loading, error } = useFetchSingleChatRooms();

  const openModal = (chat: { name: string; profileImage: string, chatRoomId: number }) => {
    setSelectedChat(chat);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChat(null);
  };

  const goToChatPage = (roomId: number) => {
    navigate(`/chat/single/${roomId}`, { state: { roomId } });
  };

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, "a h:mm"); // 오늘은 오전/오후 시간:분
    } else if (isYesterday(date)) {
      return '어제'; // 어제는 '어제'로 표시
    } else {
      return format(date, "yyyy.MM.dd"); // 그 외 날짜는 yyyy.MM.dd 형식으로 표시
    }
  };

  return (
    <div>
      {chatRooms.map((chat) => {
        const lastMessage = chat.lastMessage ? { message: chat.lastMessage, time: chat.lastMessageSentAt } : null;

        return (
          <div
            key={chat.chatRoomId}
            className="flex items-center py-4 px-4 border-b border-gray-300 cursor-pointer"
            onClick={() => goToChatPage(chat.chatRoomId)}
          >
            <img src={chat.friendDogImage} alt={chat.friend} className="w-12 h-12 rounded-full mr-4" />
            <div className="flex-1">
              <div className="font-bold text-lg">{chat.friend}</div>
              <div className="text-gray-600">{lastMessage ? lastMessage.message : 'No messages yet'}</div>
            </div>
            <div className="text-gray-400 text-sm whitespace-nowrap mr-2">
              {lastMessage ? formatLastMessageTime(lastMessage.time) : ''}
            </div>

            <button
              className="text-gray-500 z-10"
              onClick={(e) => {
                e.stopPropagation();
                openModal({
                  name: chat.friend,
                  profileImage: chat.friendDogImage,
                  chatRoomId: chat.chatRoomId,
                });
              }}
            >
              <BiDotsVerticalRounded size={24} />
            </button>
          </div>
        );
      })}

      {selectedChat && (
        <ChatOptionsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          chatName={selectedChat.name}
          chatRoomId={selectedChat.chatRoomId}
        />
      )}
    </div>
  );
};

export default SingleChatList;
