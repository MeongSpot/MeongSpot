import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import useChat from '@/hooks/chat/useChat';
import useChatDetail from '@/hooks/chat/useChatDetail';
import useChatStore from '@/store/chatStore';

const SingleChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.state?.roomId;
  const [page, setPage] = useState(0);
  const [message, setMessage] = useState('');
  const initialFriendName = location.state?.friendName;
  const [targetNickname, setTargetNickname] = useState(initialFriendName || '');

  const { setChats, addChat, getChatsByRoomId } = useChatStore();
  const { messages: fetchedMessages, loading, error, isLastPage, myId } = useChatDetail(roomId, page);
  const { sendMessage } = useChat(roomId);
  const messages = getChatsByRoomId(roomId) || [];

  const messagesEndRef = useRef<HTMLDivElement | null>(null); 

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' }); // 애니메이션 없이 즉시 이동
  }, []);

  useEffect(() => {
    if (fetchedMessages.length > 0) {
      setChats(roomId, fetchedMessages);
      scrollToBottom();
    }
  }, [fetchedMessages, roomId, setChats, scrollToBottom]);

  useEffect(() => {
    const firstNonSenderMessage = messages.find((msg) => msg.senderId !== myId);
    if (firstNonSenderMessage) {
      setTargetNickname(firstNonSenderMessage.nickname);
    }
  }, [messages, myId]);

  // 메시지가 추가될 때마다 맨 아래로 스크롤
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = () => {
    if (message.trim() && myId !== null) {
      const newMessage = {
        senderId: myId,
        message,
        sentAt: new Date().toISOString(),
        nickname: targetNickname,
        profileImage: 'default_profile_image_url',
        messageType: 'text',
      };

      sendMessage(message, myId);
      addChat(roomId, newMessage);
      setMessage('');
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
        <h1 className="text-lg font-bold flex-1">{targetNickname}</h1>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-white flex flex-col">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {[...messages].reverse().map((msg, index) => {
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
        {/* 스크롤을 맨 아래로 이동시키기 위한 참조 요소 */}
        <div ref={messagesEndRef} />
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
