import React, { useState } from 'react';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import GroupChatInfoModal from '@/components/chat/GroupChatInfoModal';

const GroupChatPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const chats = [
    { sender: '뽀삐', message: '저희 강아지 조금 소심한데 참여해도 되나요?', time: '10:23' },
    { sender: 'me', message: '그럼요 괜찮아요', time: '10:23' },
    { sender: '두부', message: '저희 강아지도 낯가려요 ㅎㅎ', time: '10:23' },
    { sender: '감자', message: '저 15분 정도 늦게 참석할 것 같아요 최대한 빨리 갈게요!', time: '17:34' },
    { sender: 'me', message: '천천히 오세요~', time: '17:35' },
    { sender: 'me', message: '1주차장 옆 광장에 다들 모여있어요~', time: '17:35' },
  ];

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log(`Send message: ${message}`);
      setMessage('');
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center bg-orange-500 text-white px-4 py-3">
        <button onClick={() => navigate(-1)} className="mr-3">
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold flex-1">채팅방</h1>
        <button onClick={() => setIsModalOpen(true)} className="text-white">
          <FiMenu size={24} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {chats.map((chat, index) => (
          <div
            key={index}
            className={`flex mb-4 ${chat.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            {chat.sender !== 'me' && (
              <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white text-sm font-bold rounded-full mr-2">
                {chat.sender}
              </div>
            )}
            <div
              className={`${
                chat.sender === 'me' ? 'bg-yellow-200' : 'bg-gray-200'
              } text-gray-800 rounded-lg px-4 py-2 inline-block max-w-xs`}
            >
              {chat.message}
              <span className="block text-xs text-gray-400 mt-1 text-right">{chat.time}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center p-3 border-t">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지 입력"
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none"
        />
        <button onClick={handleSendMessage} className="text-orange-500 ml-3">
          <FaPaperPlane size={20} />
        </button>
      </div>
      <GroupChatInfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default GroupChatPage;
