import React, { useState } from 'react';
import { FaArrowLeft, FaPaperPlane } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SingleChatPage = () => {
  const chats = [
    { sender: 'user1', message: '아까 봤던 뽀삐견주에요!', time: '10:23' },
    { sender: 'me', message: '저희 강아지랑 이름 같아서 신기하네요~~', time: '10:24' },
    { sender: 'me', message: '다음에 또 같이 산책해요~~', time: '17:34' },
  ];

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log(`Send message: ${message}`);
      setMessage(''); // 메시지 전송 후 입력 필드 비우기
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center bg-orange-500 text-white px-4 py-3">
        <button onClick={() => navigate(-1)} className="mr-3">
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">채팅방</h1>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        {chats.map((chat, index) => (
          <div
            key={index}
            className={`flex ${chat.sender === 'me' ? 'justify-end' : 'justify-start'} mb-4`}
          >
            {chat.sender !== 'me' && (
              <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white text-sm font-bold rounded-full mr-3">
                {chat.sender}
              </div>
            )}
            <div>
              <p
                className={`${
                  chat.sender === 'me' ? 'bg-yellow-200' : 'bg-gray-200'
                } text-gray-800 rounded-lg px-4 py-2 inline-block`}
              >
                {chat.message}
              </p>
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
          placeholder="메세지 입력"
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none"
        />
        <button onClick={handleSendMessage} className="text-orange-500 ml-3">
          <FaPaperPlane size={20} />
        </button>
      </div>
    </div>
  );
};

export default SingleChatPage;
