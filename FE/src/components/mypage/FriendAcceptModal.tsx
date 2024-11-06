import { NotificationInfo } from '@/types/notification';
import { IoClose } from 'react-icons/io5';

interface FriendAcceptModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedNotification: NotificationInfo | null;
  setSelectedNotification: React.Dispatch<React.SetStateAction<NotificationInfo | null>>;
}

const FriendAcceptModal = ({
  isModalOpen,
  setIsModalOpen,
  selectedNotification,
  setSelectedNotification,
}: FriendAcceptModalProps) => {
  const handleAccept = () => {
    console.log('친구 요청을 수락했습니다.');
    setIsModalOpen(false);
  };

  const handleReject = () => {
    console.log('친구 요청을 거절했습니다.');
    setIsModalOpen(false);
  };

  return (
    <div>
      {isModalOpen && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-md p-5 space-y-3 w-80 flex flex-col items-center">
            <div className="w-full flex justify-end">
              <IoClose
                onClick={() => {
                  setIsModalOpen(false);
                }}
                size={24}
              />
            </div>

            <div className="w-full flex flex-col items-center space-y-8">
              <div>
                <p>친구 요청을 수락하시겠습니까?</p>
              </div>

              <div className="w-full flex justify-end space-x-4">
                <div className="w-full flex space-x-3">
                  <button className="w-full px-4 py-2 bg-zinc-400 text-white rounded" onClick={handleReject}>
                    거절
                  </button>
                  <button className="w-full px-4 py-2 bg-deep-coral text-white rounded" onClick={handleAccept}>
                    수락
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendAcceptModal;
