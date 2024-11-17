import { useEffect } from 'react';

interface FriendsDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DogDeleteModal = ({ isOpen, onClose, onConfirm }: FriendsDeleteModalProps) => {
  // 스크롤 비활성화 처리
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // 스크롤 비활성화
    } else {
      document.body.style.overflow = ''; // 스크롤 복구
    }

    // 컴포넌트 언마운트 시 스크롤 복구
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed bg-black bg-opacity-50 inset-0 z-30 flex justify-center items-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className="bg-white rounded-lg w-5/6 max-w-xs transform transition-transform duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ top: '50%', transform: 'translateY(-50%)' }} // 화면 중앙 고정
      >
        <div className="p-6 text-center">
          <h3 className="text-lg font-bold text-gray-800">반려견 삭제</h3>
          <p className="text-gray-600 mt-2">정말로 반려견을 삭제하시겠습니까?</p>
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

export default DogDeleteModal;
