import React from 'react';

interface DogUpdateSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DogUpdateSuccessModal: React.FC<DogUpdateSuccessModalProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`absolute inset-0 z-30 bg-gray-800 bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className="bg-white rounded-lg w-5/6 max-w-xs transform transition-transform duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold text-gray-800">변경 완료</h3>
          <p className="text-gray-600 mt-2">모임에 데려갈 강아지가 변경되었습니다.</p>
        </div>

        <div className="border-t border-gray-300">
          <button
            onClick={onClose}
            className="w-full py-3 text-deep-coral hover:bg-gray-100 focus:outline-none font-semibold"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default DogUpdateSuccessModal;
