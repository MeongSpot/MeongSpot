import React, { useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import ChatOptionsModal from './ChatOptionModal';
import useFetchSingleChatRooms from '@/hooks/chat/useFetchSingleChatRooms';
import { format, isToday, isYesterday } from 'date-fns';

const SingleChatList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<{ name: string; profileImage: string; chatRoomId: number } | null>(
    null,
  );
  const navigate = useNavigate();

  const { chatRooms, loading, error } = useFetchSingleChatRooms();

  const openModal = (chat: { name: string; profileImage: string; chatRoomId: number }) => {
    setSelectedChat(chat);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChat(null);
  };

  const goToChatPage = (roomId: number, friendName: string) => {
    navigate(`/chat/single/${roomId}`, { state: { roomId, friendName } });
  };

  const formatLastMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, 'a h:mm'); // 오늘은 오전/오후 시간:분
    } else if (isYesterday(date)) {
      return '어제'; // 어제는 '어제'로 표시
    } else {
      return format(date, 'yyyy.MM.dd'); // 그 외 날짜는 yyyy.MM.dd 형식으로 표시
    }
  };

  if (chatRooms.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center mt-[-10vh] text-center">
        <div className="flex flex-col justify-center items-center h-64 text-gray-500">
          <h1 className="mb-4">현재 활성화된 채팅방이 없습니다.</h1>
          <p className="text-sm text-gray-400 mb-6">친구와 새 채팅을 시작하려면 친구 목록으로 이동해보세요.</p>
          <button onClick={() => navigate('/friendslist')} className="bg-deep-coral text-white px-6 py-2 rounded-full">
            친구 목록으로 이동
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {chatRooms.map((chat) => {
        const lastMessage = chat.lastMessage ? { message: chat.lastMessage, time: chat.lastMessageSentAt } : null;

        return (
          <div
            key={chat.chatRoomId}
            className="flex items-center py-4 px-4 border-b border-gray-300 cursor-pointer"
            onClick={() => goToChatPage(chat.chatRoomId, chat.interlocutorNickname)}
          >
            <img
              src={chat.interlocutorProfileImage || '/icons/favicon/favicon-96x96.png'}
              alt={chat.interlocutorNickname}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div className="flex-1">
              <div className="font-bold text-lg">{chat.interlocutorNickname}</div>
              <div className="text-gray-600">
                {lastMessage
                  ? lastMessage.message.length > 10
                    ? `${lastMessage.message.slice(0, 10)}...`
                    : lastMessage.message
                  : 'No messages yet'}
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="text-gray-400 text-sm whitespace-nowrap">
                {lastMessage ? formatLastMessageTime(lastMessage.time) : ''}
              </div>
              {chat.unreadMessageCnt > 0 && (
                <div className="bg-deep-coral text-white text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center mt-1">
                  {chat.unreadMessageCnt}
                </div>
              )}
            </div>

            <button
              className="text-gray-500 z-10 ml-2"
              onClick={(e) => {
                e.stopPropagation();
                openModal({
                  name: chat.interlocutorNickname,
                  profileImage: chat.interlocutorProfileImage,
                  chatRoomId: chat.chatRoomId,
                });
              }}
            >
              <BiDotsVerticalRounded size={24} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default SingleChatList;
