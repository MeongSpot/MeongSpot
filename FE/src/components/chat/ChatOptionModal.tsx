import React from 'react';
import { FiLogOut, FiBellOff } from 'react-icons/fi';

interface ChatOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatName: string;
}

const ChatOptionsModal: React.FC<ChatOptionsModalProps> = ({ isOpen, onClose, chatName }) => {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-20 bg-gray-800 bg-opacity-50 flex justify-center items-end transition-opacity duration-300 ${
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

        <h2 className="text-lg font-bold text-orange-600 mb-2">
          {chatName} <span className="text-gray-600"></span>
        </h2>

        <hr className="my-2 mb-8 border-t-2" />

        <div className="flex items-center mb-5 cursor-pointer">
          <FiLogOut className="text-gray-600 mr-3" />
          <span className="text-gray-800">채팅 나가기</span>
        </div>
        <div className="flex items-center cursor-pointer mb-10">
          <FiBellOff className="text-gray-600 mr-3" />
          <span className="text-gray-800">채팅 푸시 알림 해제</span>
        </div>

        <button onClick={onClose} className="block mx-auto mt-6 text-sm text-orange-600">
          닫기
        </button>
      </div>
    </div>
  );
};

export default ChatOptionsModal;
