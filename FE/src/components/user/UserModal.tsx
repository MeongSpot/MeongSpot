import { useCallback } from 'react';
import { FriendListInfo } from '@/types/friend';
import { UserSearchInfo } from '@/types/user';
import { useNavigate } from 'react-router-dom';
import { useFriend } from '@/hooks/friend/useFriend';
import FriendsRequestModal from '../friends/FriendsRequestModal';

interface FriendsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSearchInfo | null;
}

const UserModal = ({ isOpen, onClose, user }: FriendsModalProps) => {
  const navigate = useNavigate();
  const { requestFriend, requestFriendResponse, isRequestFriendModalOpen, setIsRequestFriendModalOpen } = useFriend();

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (isRequestFriendModalOpen) {
      setIsRequestFriendModalOpen(false);
    }
    onClose();
  };

  const handleRequestFriend = () => {
    if (!user) return;
    requestFriend(user.id);
  };

  if (!user) return null;

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
                src={user.profileImage || '/icons/favicon/favicon-96x96.png'}
                alt="Profile"
                className="w-14 h-14 rounded-full border object-cover"
              />
              <div>
                <h2 className="text-lg font-bold">
                  <span className="font-bold truncate">{user.nickname}</span>
                </h2>
                {user.dogNameList.length > 0 && (
                  <div className="text-sm flex space-x-1">
                    <p className="text-deep-coral">
                      {user.dogNameList[0]}
                      {user.dogNameList.length > 1 && ` 외 ${user.dogNameList.length - 1}마리`}
                    </p>
                    <p>견주</p>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                navigate(`/profile/${user.id}`);
                onClose();
              }}
              className="py-[0.35rem] px-3 bg-peach-orange rounded-2xl"
            >
              <p className="text-white font-medium">프로필</p>
            </button>
          </div>

          <hr />

          <div className="pt-5 py-4 space-y-5">
            <p onClick={handleRequestFriend} className="font-medium">
              친구 신청하기
            </p>
            <p className="font-medium">차단하기</p>
          </div>
        </div>
      </div>

      {/* 친구 요청 상태 모달 */}
      {isRequestFriendModalOpen && (
        <FriendsRequestModal requestFriendResponse={requestFriendResponse} setIsRequestFriendModalOpen={setIsRequestFriendModalOpen} isUserModal={true} />
      )}
    </div>
  );
};

export default UserModal;
