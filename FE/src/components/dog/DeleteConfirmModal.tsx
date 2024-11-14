import { div } from 'framer-motion/client';
import { useEffect } from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message?: string | null;
}

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, message }: DeleteConfirmModalProps) => {
  return (
    <div
      className={`max-h-screen fixed bg-black bg-opacity-50 inset-0 z-30 flex justify-center items-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className="bg-white rounded-lg w-5/6 max-w-xs transform transition-transform duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          {message === '모임 참여 반려견' ? (
            <div>
              <p className="text-gray-600 mt-2">모임에 참여 중인</p>
              <p className="text-gray-600">반려견은 삭제할 수 없습니다</p>
            </div>
          ) : (
            <p className="text-gray-600 mt-2">{message}</p>
          )}
        </div>

        <div onClick={onClose} className="flex justify-center border-t border-gray-300">
          <button className="py-3 text-blue-500 hover:bg-gray-100 focus:outline-none">확인</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
