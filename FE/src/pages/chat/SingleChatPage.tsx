import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const SingleChatPage = () => {
  const chats = [
    { sender: 'user1', message: '아까 봤던 뽀삐견주에요!', time: '10:23' },
    { sender: 'me', message: '저희 강아지랑 이름 같아서 신기하네요~~', time: '10:24' },
    { sender: 'me', message: '다음에 또 같이 산책해요~~', time: '17:34' },
  ];

  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const animateBack = location.state?.animateBack ?? true;

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log(`Send message: ${message}`);
      setMessage('');
    }
  };

  const handleBack = () => {
    navigate('/chat', { state: { withAnimation: true } });
  };

  const userClick = () => { // 나중에 상대방 유저페이지로 경로 변경
    navigate('/mypage')
  }

  return (
    <motion.div
      initial={{ x: animateBack ? 300 : 0, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: animateBack ? -300 : 0, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex flex-col h-screen"
    >
      <div className="flex items-center bg-deep-coral text-white p-4">
        <button onClick={handleBack} className="mr-3">
          <IoChevronBack size={24} />
        </button>
        <h1 className="text-lg font-bold">채팅방</h1>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {chats.map((chat, index) => (
          <div key={index} className={`flex ${chat.sender === 'me' ? 'justify-end' : 'justify-start'} mb-4`}>
            {chat.sender !== 'me' && (
              <div onClick={userClick} className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white text-sm font-bold rounded-full mr-3 cursor-pointer">
                {chat.sender}
              </div>
            )}
            <div className="flex flex-col max-w-xs">
            {chat.sender !== 'me' && chat.sender}
              <div className={`flex items-end ${chat.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                <p
                  className={`${
                    chat.sender === 'me' ? 'bg-cream-bg' : 'bg-gray-200'
                  } text-gray-800 rounded-lg px-4 py-2 inline-block`}
                >
                  {chat.message}
                </p>
                <span
                  className={`text-xs text-gray-400 ${chat.sender === 'me' ? 'mr-2' : 'ml-2'}`}
                  style={{
                    alignSelf: 'flex-end',
                    marginBottom: '4px',
                  }}
                >
                  {chat.time}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center p-3 border-t">
        <div className="relative flex-1">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="메세지 입력"
            className="w-full flex-1 bg-gray-100 rounded-full px-4 py-2 pr-10 outline-none"
          />
          {message && (
            <button
              onClick={handleSendMessage}
              className="absolute inset-y-0 right-3 flex items-center text-deep-coral"
            >
              <FaPaperPlane size={20} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SingleChatPage;
