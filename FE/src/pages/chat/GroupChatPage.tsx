import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import { FiMenu } from 'react-icons/fi';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import GroupChatInfoModal from '@/components/chat/GroupChatInfoModal';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

const GroupChatPage = () => {
  const { id: roomId } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const animateBack = location.state?.animateBack ?? true;

  const handleBack = () => {
    navigate('/mymeetuproom', { state: { animateBack: false } });
  };

  const chats = [
    { sender: '뽀삐', message: '저희 강아지 조금 소심한데 참여해도 되나요?', time: '10:23' },
    { sender: 'me', message: '그럼요 괜찮아요', time: '10:23' },
    { sender: '두부', message: '저희 강아지도 낯가려요 ㅎㅎ', time: '10:23' },
    { sender: '깜자', message: '저 15분 정도 늦게 참석할 것 같아요 최대한 빨리 갈게요!', time: '17:34' },
    { sender: 'me', message: '천천히 오세요~', time: '17:35' },
    { sender: 'me', message: '1주차장 옆 광장에 다들 모여있어요~', time: '17:35' },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log(`Send message: ${message}`);
      setMessage('');
    }
  };

  const handleViewDetails = () => {
    setIsModalOpen(false);
    navigate(`/meetupdoglist/${roomId}`, { state: { animateBack: false } });
  };
  const userClick = () => {
    // 나중에 상대방 유저페이지로 경로 변경
    navigate('/mypage');
  };

  return (
    <motion.div
      initial={{ x: 300, opacity: 0 }} // 항상 오른쪽에서 시작
      animate={{ x: 0, opacity: 1 }} // 가운데로 이동
      exit={{ x: 300, opacity: 0 }} // 왼쪽으로 퇴장
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="flex flex-col h-screen"
    >
      <div className="flex items-center bg-deep-coral text-white p-4">
        <button onClick={handleBack} className="mr-3">
          <IoChevronBack size={24} />
        </button>
        <h1 className="text-lg font-bold flex-1">채팅방</h1>
        <button onClick={() => setIsModalOpen(true)} className="text-white">
          <FiMenu size={24} />
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {chats.map((chat, index) => (
          <div key={index} className={`flex mb-4 ${chat.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            {chat.sender !== 'me' && (
              <div
                onClick={userClick}
                className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white text-sm font-bold rounded-full mr-2 cursor-pointer"
              ></div>
            )}
            <div className="flex flex-col max-w-xs">
              {chat.sender !== 'me' && chat.sender}
              <div className={`flex items-end ${chat.sender === 'me' ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`${
                    chat.sender === 'me' ? 'bg-cream-bg' : 'bg-gray-200'
                  } text-gray-800 rounded-lg px-4 py-2`}
                >
                  {chat.message}
                </div>
                <span
                  className={`text-xs text-gray-400 ml-2 ${chat.sender === 'me' ? 'mr-2' : 'ml-2'}`}
                  style={{ alignSelf: 'flex-end', marginBottom: '4px' }}
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
            placeholder="메시지 입력"
            className="w-full flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none"
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
