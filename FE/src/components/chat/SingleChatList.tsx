import React, { useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';
import ChatOptionsModal from './ChatOptionModal';

interface Message {
  message: string;
  time: string;
}

interface SingleChat {
  id: number;
  name: string;
  profileImage: string;
  messages: Message[];
}

const SingleChatList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<SingleChat | null>(null);
  const navigate = useNavigate();

  const singleChats: SingleChat[] = [
    {
      id: 1,
      name: '뽀삐언니',
      profileImage: 'path-to-profile-image1.png',
      messages: [{ message: '다음에 또 같이 산책해요~~', time: '17:35' }],
    },
    {
      id: 2,
      name: '로나',
      profileImage: 'path-to-profile-image2.png',
      messages: [{ message: '죄송해요ㅠㅠ 오늘 못가겠네요..', time: '어제' }],
    },
    {
      id: 3,
      name: '깽깽엄마',
      profileImage: 'path-to-profile-image3.png',
      messages: [{ message: '간식 공유 하실래요?!', time: '어제' }],
    },
    {
      id: 4,
      name: '뽀송이주인',
      profileImage: 'path-to-profile-image4.png',
      messages: [{ message: '안녕하세요 친해지고 싶어요~', time: '10/22' }],
    },
  ];

  const openModal = (chat: SingleChat) => {
    setSelectedChat(chat);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedChat(null);
  };

  const goToChatPage = (chatId: number) => {
    navigate(`/chat/single/${chatId}`); // 채팅방 페이지로 이동
  };

  return (
    <div>
      {singleChats.map((chat) => {
        const lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;

        return (
          <div
            key={chat.id}
            className="flex items-center py-4 px-4 border-b border-gray-300 cursor-pointer"
            onClick={() => goToChatPage(chat.id)} // 아이콘 제외 영역 클릭 시 이동
          >
            <img src={chat.profileImage} alt={chat.name} className="w-12 h-12 rounded-full mr-4" />
            <div className="flex-1">
              <div className="font-bold text-lg">{chat.name}</div>
              <div className="text-gray-600">{lastMessage ? lastMessage.message : 'No messages yet'}</div>
            </div>
            <div className="text-gray-400 text-sm whitespace-nowrap mr-2">{lastMessage ? lastMessage.time : ''}</div>
            <button
              className="text-gray-500 z-10"
              onClick={(e) => {
                e.stopPropagation(); // 이벤트 전파 방지하여 아이콘 클릭 시 페이지 이동 차단
                openModal(chat);
              }}
            >
              <BiDotsVerticalRounded size={24} />
            </button>
          </div>
        );
      })}

      <ChatOptionsModal isOpen={isModalOpen} onClose={closeModal} chatName={selectedChat ? selectedChat.name : ''} />
    </div>
  );
};

export default SingleChatList;
