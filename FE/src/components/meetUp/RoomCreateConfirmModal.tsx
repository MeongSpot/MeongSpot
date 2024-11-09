// components/map/CreateMeetupConfirmModal.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface RoomCreateConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  spotName: string; // 스팟 이름을 받아서 표시
  spotId: number;
}

const RoomCreateConfirmModal: React.FC<RoomCreateConfirmModalProps> = ({ isOpen, onClose, spotName, spotId }) => {
  const navigate = useNavigate();

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  const handleCreateMeetup = () => {
    navigate(`/allMeetUpRoom/${spotId}/create`);
    onClose(); // 모달 닫기 추가
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
          <h3 className="text-lg font-bold text-gray-800">모임 개설하기</h3>
          <p className="text-gray-600 mt-2">
            <span className="text-deep-coral font-medium">{spotName}</span>
            에서
            <br />
            새로운 산책 모임을 만드시겠어요?
          </p>
        </div>

        <div className="flex border-t border-gray-300">
          <button
            onClick={onClose}
            className="w-1/2 py-3 text-gray-500 hover:bg-gray-100 transition-colors focus:outline-none"
          >
            취소
          </button>
          <div className="w-px bg-gray-300"></div>
          <button
            onClick={handleCreateMeetup}
            className="w-1/2 py-3 text-deep-coral font-medium hover:bg-gray-100 transition-colors focus:outline-none"
          >
            만들기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCreateConfirmModal;
