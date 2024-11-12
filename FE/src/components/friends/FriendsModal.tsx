import { useState } from 'react';
import { FriendListInfo } from '@/types/friend';
import { useNavigate } from 'react-router-dom';
import { useFriend } from '@/hooks/friend/useFriend';
import FriendsDeleteModal from './FriendsDeleteModal';

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  friend: FriendListInfo | null;
}

const FriendsModal = ({ isOpen, onClose, onDelete, friend }: FriendsModalProps) => {
  const navigate = useNavigate();
  const { deleteFriend } = useFriend();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    onClose();
  };

  if (!friend) return null;

  return (
    <div
      className={`fixed inset-0 z-20 bg-gray-800 bg-opacity-50 flex justify-center items-end transition-all duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={handleBackgroundClick}
    >
      <div
        className={`bg-white rounded-t-lg w-full px-6 py-6 max-w-md transform transition-all duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6"></div>

        <div>
          <div className="py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={friend.profileImage || '/icons/favicon/favicon-96x96.png'}
                alt="Profile"
                className="w-14 h-14 rounded-full border object-cover"
              />
              <div>
                <h2 className="text-lg font-bold">
                  <span className="font-bold truncate">{friend.nickname}</span>
                </h2>
                {friend.dogNames.length > 0 && (
                  <div className="text-sm flex space-x-1">
                    <p className="text-deep-coral">
                      {friend.dogNames[0]}
                      {friend.dogNames.length > 1 && ` 외 ${friend.dogNames.length - 1}마리`}
                    </p>
                    <p>견주</p>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                navigate(`/profile/${friend.id}`);
                onClose();
              }}
              className="py-[0.35rem] px-3 bg-peach-orange rounded-2xl"
            >
              <p className="text-white font-medium">프로필</p>
            </button>
          </div>

          <hr />

          <div className="pt-5 py-4 space-y-5">
            <p
              onClick={() => {
                setIsDeleteModalOpen(!isDeleteModalOpen);
              }}
              className="font-medium"
            >
              친구 삭제하기
            </p>
            <p className="font-medium">차단하기</p>
          </div>
        </div>
      </div>

      {isDeleteModalOpen && (
        <FriendsDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={onDelete}
        />
      )}
    </div>
  );
};

export default FriendsModal;
