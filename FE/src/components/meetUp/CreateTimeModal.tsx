import React from 'react';

interface CreateTimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  startTime: string;
  setStartTime: (time: string) => void;
}

const CreateTimeModal: React.FC<CreateTimeModalProps> = ({ isOpen, onClose, startTime, setStartTime }) => {
  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSave = () => {
    if (!startTime) setStartTime('00:00');
    onClose();
  };

  return (
    <div
      onClick={handleBackgroundClick}
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-lg w-72">
        <h2 className="text-lg font-bold mb-4">시간 선택</h2>
        <label className="block text-sm mb-1">시작 시간</label>
        <input
          type="time"
          className="w-full p-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-deep-coral"
          value={startTime || '00:00'}
          onChange={(e) => setStartTime(e.target.value)}
        />
        <button
          onClick={handleSave}
          className="w-full bg-deep-coral text-white py-2 rounded-lg font-bold hover:bg-opacity-90 transition-colors"
        >
          선택 완료
        </button>
      </div>
    </div>
  );
};

export default CreateTimeModal;
