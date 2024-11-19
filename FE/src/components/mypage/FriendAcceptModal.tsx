import { useState } from 'react';
import { Notification } from '@/types/alarm';
import { IoClose } from 'react-icons/io5';
import useAddFriend from '@/hooks/alarm/useAddFriend';

interface FriendAcceptModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedNotification: Notification | null;
  setSelectedNotification: React.Dispatch<React.SetStateAction<Notification | null>>;
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const FriendAcceptModal = ({
  isModalOpen,
  setIsModalOpen,
  selectedNotification,
  setSelectedNotification,
  setNotifications,
}: FriendAcceptModalProps) => {
  const { respondToInvitation, loading, error, successMessage } = useAddFriend();

  const handleAccept = async () => {
    if (selectedNotification) {
      await respondToInvitation(selectedNotification.notificationId, true);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.notificationId !== selectedNotification.notificationId),
      );
      setIsModalOpen(false);
      setSelectedNotification(null);
    }
  };

  const handleReject = async () => {
    if (selectedNotification) {
      await respondToInvitation(selectedNotification.notificationId, false);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.notificationId !== selectedNotification.notificationId),
      );
      setIsModalOpen(false);
      setSelectedNotification(null);
    }
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
                  setSelectedNotification(null);
                }}
                size={24}
              />
            </div>

            <div className="w-full flex flex-col items-center space-y-8">
              <div>
                <p>친구 요청을 수락하시겠습니까?</p>
              </div>

              <div className="w-full flex space-x-3">
                <button
                  className="w-full px-4 py-2 bg-zinc-400 text-white rounded"
                  onClick={handleReject}
                  disabled={loading}
                >
                  거절
                </button>
                <button
                  className="w-full px-4 py-2 bg-deep-coral text-white rounded"
                  onClick={handleAccept}
                  disabled={loading}
                >
                  수락
                </button>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            {successMessage && <p className="text-green-500 text-sm mt-2">{successMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendAcceptModal;
