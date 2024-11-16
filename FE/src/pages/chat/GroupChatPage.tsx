import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import GroupChatInfoModal from '@/components/chat/GroupChatInfoModal';
import { motion } from 'framer-motion';
import useChat from '@/hooks/chat/useChat';
import useChatDetail from '@/hooks/chat/useChatDetail';
import useMarkRead from '@/hooks/chat/useMarkRead';
import { Chat } from '@/types/singleChat';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { differenceInCalendarDays, format } from 'date-fns';
import { useMyMeeting } from '@/hooks/meetup/useMyMeeting';

const GroupChatPage = () => {
  const { id: roomId } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [nickname, setNickname] = useState('');
  const [page, setPage] = useState(0);
  const [localMessages, setLocalMessages] = useState<Chat[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const animateBack = location.state?.animateBack ?? true;

  const { messages: fetchedMessages, loading, error, myId } = useChatDetail(Number(roomId), page);
  const { sendMessage, receiveMessage } = useChat(Number(roomId), nickname);
  const { meetings } = useMyMeeting();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const markRead = useMarkRead(Number(roomId));
  
  const currentMeeting = meetings.find((meeting) => meeting.meetingId === Number(roomId)); 
  
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView();
    }, 50);
  };

  const handleScrollToTopLoad = useCallback(() => {
    if (messagesContainerRef.current && !loading) {
      const previousScrollHeight = messagesContainerRef.current.scrollHeight;
      setPage((prevPage) => prevPage + 1);

      setTimeout(() => {
        if (messagesContainerRef.current) {
          const newScrollHeight = messagesContainerRef.current.scrollHeight;
          messagesContainerRef.current.scrollTop = newScrollHeight - previousScrollHeight;
        }
      }, 100);
    }
  }, [loading]);

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
    if (page === 0 && fetchedMessages.length > 0) {
      scrollToBottom();
    }
  }, [page, fetchedMessages]);

  const handleSendMessage = () => {
    if (message.trim() && myId !== null) {
      sendMessage(message, myId);
      setMessage('');
      scrollToBottom();
    }
  };

  const handleBack = () => {
    markRead();
    navigate('/mymeetuproom', { state: { animateBack: true } });
  };

  const handleViewDetails = () => {
    setIsModalOpen(false);
    navigate(`/meetupdoglist/${roomId}`, { state: { animateBack: true } });
  };

  const formatDateLabel = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const dayDifference = differenceInCalendarDays(today, date);
    if (dayDifference === 0) return '오늘';
    if (dayDifference === 1) return '어제';
    return format(date, 'yyyy년 M월 d일');
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex flex-col h-screen"
    >
      <div className="flex items-center bg-deep-coral text-white p-4">
        <button onClick={handleBack} className="mr-3">
          <IoChevronBack size={24} />
        </button>
        <h1 className="text-lg font-bold flex-1">
          {currentMeeting ? currentMeeting.title : '채팅방'}
        </h1>

        <button onClick={() => setIsModalOpen(true)} className="text-white">
          <FiMenu size={24} />
        </button>
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
        {loading && <LoadingOverlay />}
        {error && <p className="text-red-500">{error}</p>}

        {localMessages.map((msg, index) => {
          const isSender = msg.senderId === myId;
          const showDateLabel =
            index === 0 || formatDateLabel(msg.sentAt) !== formatDateLabel(localMessages[index - 1]?.sentAt);
          return (
            <div key={`${msg.sentAt}-${index}`} className="flex flex-col mb-4">
              {showDateLabel && (
                <div className="flex justify-center my-2">
                  <span className="text-xs text-gray-500">{formatDateLabel(msg.sentAt)}</span>
                </div>
              )}
              {msg.messageType === 'NOTICE' ? (
                <div className="flex justify-center my-2">
                  <span className="text-sm text-blue-500 bg-blue-100 px-4 py-2 rounded-md">
                    {msg.message}
                  </span>
                </div>
              ) : (
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
              )}
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
                e.preventDefault(); // 기본 Enter 동작 방지
                handleSendMessage(); // 메시지 전송 함수 호출
              }
            }}
            rows={1}
            className="w-full bg-gray-100 rounded-full px-4 py-2 outline-none resize-none overflow-hidden"
            style={{ paddingRight: '2.5rem' }} // 아이콘 공간 확보
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

      <GroupChatInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onViewDetails={handleViewDetails}
      />
    </motion.div>
  );
};

export default GroupChatPage;
