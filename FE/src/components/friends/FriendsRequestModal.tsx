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
      <div
        className="bg-white rounded-lg w-5/6 max-w-xs transform transition-transform duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <p className="text-gray-600 mt-2">{requestFriendResponse}</p>
        </div>

        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsRequestFriendModalOpen(false);
          }}
          className="flex justify-center border-t border-gray-300"
        >
          <button className="py-3 text-blue-500 hover:bg-gray-100 focus:outline-none">확인</button>
        </div>
      </div>
    </div>
  );
};

export default FriendsRequestModal;
