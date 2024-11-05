import React, { useState } from 'react';
import { FiLogOut, FiBellOff } from 'react-icons/fi';
import { FaBell } from 'react-icons/fa';
import ChatOutModal from './ChatOutModal';

interface ChatOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatName: string;
}

const ChatOptionsModal: React.FC<ChatOptionsModalProps> = ({ isOpen, onClose, chatName }) => {
  const [isChatOutModalOpen, setIsChatOutModalOpen] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  const openChatOutModal = () => {
    setIsChatOutModalOpen(true);
  };

  const closeChatOutModal = () => {
    setIsChatOutModalOpen(false);
  };

  const handleConfirmChatOut = () => {
    console.log(`${chatName} 채팅방에서 나갔습니다.`);
    setIsChatOutModalOpen(false);
    onClose();
  };

  const toggleNotification = () => {
    setIsNotificationEnabled((prev) => !prev);
  };


  return (
    <>
      <div
        className={`fixed inset-0 z-20 bg-gray-800 bg-opacity-50 flex justify-center items-end transition-opacity duration-300 mb-16 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackgroundClick}
      >
        <div
          className={`bg-white rounded-t-lg w-full max-w-md p-6 transform transition-transform duration-300 ${
            isOpen ? 'translate-y-0' : 'translate-y-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>

          <h2 className="text-lg font-bold text-deep-coral mb-2">
            {chatName} <span className="text-gray-600"></span>
          </h2>

          <hr className="my-2 mb-5 border-t-2" />

          <div onClick={openChatOutModal} className="flex items-center mb-5 cursor-pointer">
            <FiLogOut className="text-gray-600 mr-3" />
            <span className="text-gray-800">채팅 나가기</span>
          </div>
          <div onClick={toggleNotification} className="flex items-center cursor-pointer">
            {isNotificationEnabled ? (
              <FaBell className="text-gray-600 mr-3" />
            ) : (
              <FiBellOff className="text-gray-600 mr-3" />
            )}
            <span className="text-gray-800">
              {isNotificationEnabled ? '알림 설정됨' : '채팅 푸시 알림 해제'}
            </span>
          </div>
        </div>
      </div>
      <ChatOutModal
      isOpen={isChatOutModalOpen}
      onClose={closeChatOutModal}
      onConfirm={handleConfirmChatOut}
      chatName={chatName}
    />
  </>
  );
};

export default ChatOptionsModal;
