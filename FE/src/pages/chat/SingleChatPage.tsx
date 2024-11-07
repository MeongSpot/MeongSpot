import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
// import useChat from '@/hooks/chat/useChat';
import useChatDetail from '@/hooks/chat/useChatDetail';

const SingleChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.state?.roomId;
  const [page, setPage] = useState(0);
  const [message, setMessage] = useState('');

  // 현재 채팅방의 메시지 목록과 사용자 ID를 가져오는 커스텀 훅
  const { messages, loading, error, isLastPage, myId } = useChatDetail(roomId, page);
  // const { chats, sendMessage } = useChat(roomId);

  const handleSendMessage = () => {
    if (message.trim() && myId !== null) {
      // sendMessage(message, myId);
      setMessage(''); // 메시지 전송 후 입력 필드를 초기화
    }
  };

  const handleBack = () => {
    navigate('/chat', { state: { animateBack: true } });
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex flex-col h-screen"
    >
      <div className="flex items-center bg-deep-coral text-white p-4">
        <button onClick={handleBack} className="mr-3">
          <IoChevronBack size={24} />
        </button>
        <h1 className="text-lg font-bold flex-1">채팅방</h1>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-white flex flex-col">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {messages.map((msg, index) => {
          const isSender = msg.senderId === myId;

          return (
            <div
              key={`${msg.sentAt}-${index}`}
              className={`flex mb-4 ${isSender ? 'justify-end' : 'justify-start'}`}
            >
              {!isSender && (
                <div
                  className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white text-sm font-bold rounded-full mr-2 cursor-pointer"
                  onClick={() => navigate(`/mypage/${msg.senderId}`)}
                >
                </div>
              )}
              <div className="flex flex-col max-w-xs">
                {!isSender && <span className="text-xs text-gray-500 mb-1">{msg.nickname}</span>}
                <div className={`flex items-end ${isSender ? 'flex-row-reverse' : ''}`}>
                  <div
                    className={`${
                      isSender ? 'bg-cream-bg' : 'bg-gray-200'
                    } text-gray-800 rounded-lg px-4 py-2`}
                  >
                    {msg.message}
                  </div>
                  <span
                    className={`text-xs text-gray-400 ml-2 ${isSender ? 'mr-2' : 'ml-2'}`}
                    style={{ alignSelf: 'flex-end', marginBottom: '4px' }}
                  >
                    {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center p-3 border-t bg-white">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="메시지 입력"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-gray-100 rounded-full px-4 py-2 outline-none"
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
