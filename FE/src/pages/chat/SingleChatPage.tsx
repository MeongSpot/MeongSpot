import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Chat from '@/components/chat/Chat';

const SingleChatPage = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.state?.roomId;
  const animateBack = location.state?.animateBack ?? true;

  if (!roomId) {
    navigate('/chat');
    return null;
  }
  
  const handleSendMessage = () => {
    if (message.trim()) {
      console.log(`Send message: ${message}`);
      setMessage('');
    }
  };

  const handleBack = () => {
    navigate('/chat', { state: { animateBack: true } });
  };

  const userClick = (userId: number) => {
    // 나중에 상대방 유저페이지로 경로 변경
    navigate(`/mypage/`);
  };

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
        <Chat roomId={roomId} userClick={userClick} />
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
