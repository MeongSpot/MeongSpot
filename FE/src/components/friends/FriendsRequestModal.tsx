import React from 'react';

interface FriendsRequestModalProps {
  requestFriendResponse: string | null;
  setIsRequestFriendModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isUserModal?: boolean;
}

const FriendsRequestModal: React.FC<FriendsRequestModalProps> = ({
  requestFriendResponse,
  setIsRequestFriendModalOpen,
  isUserModal,
}) => {
  return (
    <div
      className={`p-5 fixed inset-0 ${!isUserModal ? 'bg-black bg-opacity-50' : ''} flex justify-center items-center z-50`}
    >
      <div className="bg-white py-9 h-44 rounded-lg shadow-lg w-full flex flex-col items-center space-y-10">
        <p className="font-medium">{requestFriendResponse}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsRequestFriendModalOpen(false);
          }}
          className="bg-deep-coral text-white px-4 py-2 rounded-lg"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default FriendsRequestModal;
