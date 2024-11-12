import React from 'react';

interface FriendsDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const FriendsDeleteModal = ({isOpen, onClose, onConfirm}:FriendsDeleteModalProps) => {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-30 flex justify-center items-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleBackgroundClick}
    >
      <div
        className="bg-white rounded-lg w-5/6 max-w-xs transform transition-transform duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold text-gray-800">친구 삭제</h3>
          <p className="text-gray-600 mt-2">정말로 친구를 삭제하시겠습니까?</p>
        </div>

        <div className="flex border-t border-gray-300">
          <button onClick={onClose} className="w-1/2 py-3 text-blue-600 hover:bg-gray-100 focus:outline-none">
            취소
          </button>
          <div className="w-px bg-gray-300"></div>
          <button onClick={onConfirm} className="w-1/2 py-3 text-red-500 hover:bg-gray-100 focus:outline-none">
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default FriendsDeleteModal;
