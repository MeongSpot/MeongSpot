// components/common/Modal/NoDogModal.tsx
import React from 'react';

interface NoDogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const NoDogModal: React.FC<NoDogModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  return (
    <div
      className={`absolute inset-0 z-30 bg-gray-800 bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleBackgroundClick}
    >
      <div
        className="bg-white rounded-lg w-5/6 max-w-xs transform transition-transform duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold text-gray-800">반려견 등록 필요</h3>
          <p className="text-gray-600 mt-2">모임 생성을 위해서는 반려견 등록이 필요합니다.</p>
        </div>

        <div className="flex border-t border-gray-300">
          <button onClick={onClose} className="w-1/2 py-3 text-gray-500 hover:bg-gray-100 focus:outline-none">
            취소
          </button>
          <div className="w-px bg-gray-300"></div>
          <button onClick={onConfirm} className="w-1/2 py-3 text-deep-coral hover:bg-gray-100 focus:outline-none">
            등록하러 가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoDogModal;
