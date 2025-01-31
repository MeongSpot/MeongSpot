import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import useChat from '@/hooks/chat/useChat';
import useChatDetail from '@/hooks/chat/useChatDetail';
import useMarkRead from '@/hooks/chat/useMarkRead';
import { differenceInCalendarDays, format } from 'date-fns';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { Chat } from '@/types/singleChat';

const SingleChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const roomId = location.state?.roomId;
  const [page, setPage] = useState(0);
  const [message, setMessage] = useState('');
  const initialFriendName = location.state?.friendName;
  const [targetNickname, setTargetNickname] = useState(initialFriendName || '');
  const [showLoading, setShowLoading] = useState(true);
  const [localMessages, setLocalMessages] = useState<Chat[]>([]);

  const {
    messages: fetchedMessages,
    loading,
    error,
    isLastPage,
    myId,
    nickname,
    profileImage,
  } = useChatDetail(roomId, page);
  const { sendMessage, receiveMessage } = useChat(roomId, nickname, profileImage);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const markRead = useMarkRead(roomId);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView();
    }, 50);
  };

  const handleScrollToTopLoad = useCallback(() => {
    if (messagesContainerRef.current && !loading && !isLastPage) {
      const previousScrollHeight = messagesContainerRef.current.scrollHeight;
      setPage((prevPage) => prevPage + 1);

      setTimeout(() => {
        if (messagesContainerRef.current) {
          const newScrollHeight = messagesContainerRef.current.scrollHeight;
          messagesContainerRef.current.scrollTop = newScrollHeight - previousScrollHeight;
        }
      }, 100);
    }
  }, [loading, isLastPage]);

  useEffect(() => {
    if (fetchedMessages.length > 0) {
      setLocalMessages((prevMessages) => {
        const newMessages = fetchedMessages.filter(
          (newMsg) => !prevMessages.some((oldMsg) => oldMsg.sentAt === newMsg.sentAt),
        );
        return [...newMessages, ...prevMessages];
      });

      if (page === 0) scrollToBottom();
    }
  }, [fetchedMessages, page]);

  useEffect(() => {
    receiveMessage((newMessage: Chat) => {
      setLocalMessages((prevMessages) => [...prevMessages, newMessage]);
      scrollToBottom();
    });
  }, [receiveMessage]);

  useEffect(() => {
    const firstNonSenderMessage = localMessages.find((msg) => msg.senderId !== myId);
    if (firstNonSenderMessage) {
      setTargetNickname(firstNonSenderMessage.nickname);
    }
  }, [localMessages, myId]);

  useEffect(() => {
    const loadingTimeout = setTimeout(() => setShowLoading(false), 500);
    return () => clearTimeout(loadingTimeout);
  }, []);

  const handleSendMessage = () => {
    if (message.trim() && myId !== null) {
      const newMessage: Chat = {
        senderId: myId,
        message,
        sentAt: new Date().toISOString(),
        nickname: nickname || 'Anonymous',
        profileImage: profileImage,
        messageType: 'text',
      };
      sendMessage(message, myId);
      setMessage('');
      scrollToBottom();
    }
  };

  const handleBack = () => {
    markRead();
    navigate('/chat', { state: { animateBack: true } });
  };

  const formatDateLabel = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const dayDifference = differenceInCalendarDays(today, date);
    if (dayDifference === 0) return '오늘';
    if (dayDifference === 1) return '어제';
    return format(date, 'yyyy년 M월 d일');
  };

  const isDifferentDate = (current: string, previous: string | null): boolean => {
    if (!previous) return true;
    const currentDate = new Date(current).toDateString();
    const previousDate = new Date(previous).toDateString();
    return currentDate !== previousDate;
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex flex-col h-screen"
    >
      <div className="flex items-center bg-deep-coral text-white p-4 sticky top-0 z-10">
        <button onClick={handleBack} className="mr-3">
          <IoChevronBack size={24} />
        </button>
        <h1 className="text-lg font-bold flex-1">{targetNickname}</h1>
      </div>

      <div
        className="flex-1 p-4 overflow-y-auto bg-white flex flex-col"
        ref={messagesContainerRef}
        onScroll={() => {
          if (messagesContainerRef.current?.scrollTop === 0) {
            handleScrollToTopLoad();
          }
        }}
      >
        {(loading || showLoading) && <LoadingOverlay />}
        {error && <p className="text-red-500">{error}</p>}

        {localMessages.map((msg, index) => {
          const isSender = msg.senderId === myId;
          const showDateLabel = isDifferentDate(msg.sentAt, localMessages[index - 1]?.sentAt);
          return (
            <div key={`${msg.sentAt}-${index}`} className="flex flex-col mb-4">
              {showDateLabel && (
                <div className="flex justify-center my-2">
                  <span className="text-xs text-gray-500">{formatDateLabel(msg.sentAt)}</span>
                </div>
              )}
              <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
                {!isSender && (
                  <div onClick={() => navigate(`/profile/${msg.senderId}`)}>
                    <img
                      src={msg.profileImage || '/icons/favicon/favicon-96x96.png'}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover mx-2"
                    />
                  </div>
                )}
                <div className="flex flex-col max-w-xs">
                  {!isSender && <span className="text-xs text-gray-500 mb-1">{msg.nickname}</span>}
                  <div className={`flex items-end ${isSender ? 'flex-row-reverse' : ''}`}>
                    <div className={`${isSender ? 'bg-cream-bg' : 'bg-gray-200'} text-gray-800 rounded-lg px-4 py-2`}>
                      {msg.message}
                    </div>
                    <span
                      className={`text-xs text-gray-400 ml-2 ${isSender ? 'mr-2' : 'ml-2'}`}
                      style={{ alignSelf: 'flex-end', marginBottom: '4px' }}
                    >
                      {msg.sentAt &&
                        new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center p-3 border-t bg-white">
        <div className="relative flex-1">
          <textarea
            placeholder="메시지 입력"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            rows={1}
            className="w-full bg-gray-100 rounded-full px-4 py-2 outline-none resize-none overflow-hidden"
            style={{ paddingRight: '2.5rem' }}
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
