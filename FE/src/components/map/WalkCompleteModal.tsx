import React from 'react';
import { useNavigate } from 'react-router-dom';

interface WalkCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WalkCompleteModal: React.FC<WalkCompleteModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  const handleGoToMyPage = () => {
    navigate('/mypage');
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-30 bg-gray-800 bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleBackgroundClick}
    >
      <div
        className="bg-white rounded-lg w-5/6 max-w-xs transform transition-transform duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold text-gray-800">산책 기록 완료</h3>
          <p className="text-gray-600 mt-2">산책 기록이 저장되었습니다</p>
        </div>

        <div className="flex border-t border-gray-300">
          <button onClick={onClose} className="w-1/2 py-3 text-blue-600 hover:bg-gray-100 focus:outline-none">
            홈으로
          </button>
          <div className="w-px bg-gray-300"></div>
          <button
            onClick={handleGoToMyPage}
            className="w-1/2 py-3 text-deep-coral hover:bg-gray-100 focus:outline-none"
          >
            기록 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalkCompleteModal;
