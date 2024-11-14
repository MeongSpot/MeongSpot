import React from 'react';

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorCode: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ isOpen, onClose, errorCode }) => {
  const getErrorMessage = (code: string) => {
    switch (code) {
      case 'ME003':
        return '로그인이 필요한 서비스입니다. 다시 로그인해주세요!';
      case 'MT001':
        return '존재하지 않는 모임입니다. 다른 모임을 선택해주세요!';
      case 'MT003':
        return '이미 가입한 그룹입니다!';
      case 'DO003':
        return '선택하신 반려견 정보를 찾을 수 없습니다. 다시 시도해주세요!';
      case 'MT002':
        return '모임 정원이 가득 찼습니다. 다른 모임을 찾아보세요!';
      default:
        return '일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요!';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-lg w-5/6 max-w-xs transform transition-transform duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold text-gray-800">참여 실패</h3>
          <p className="text-gray-600 mt-2">{getErrorMessage(errorCode)}</p>
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

export default ErrorModal;
