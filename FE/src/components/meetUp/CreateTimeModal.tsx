import React from 'react';

interface CreateTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  startTime: string;
  endTime: string;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
}

const CreateTimeModal: React.FC<CreateTimeModalProps> = ({
  isOpen,
  onClose,
  startTime,
  endTime,
  setStartTime,
  setEndTime,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-72">
        <h2 className="text-lg font-bold mb-4">시간 선택</h2>
        <label className="block text-sm mb-1">시작 시간</label>
        <input
          type="time"
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <label className="block text-sm mb-1">종료 시간</label>
        <input
          type="time"
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
        <button
          onClick={onClose}
          className="w-full bg-deep-coral text-white py-2 rounded-lg font-bold"
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default CreateTimeModal;
