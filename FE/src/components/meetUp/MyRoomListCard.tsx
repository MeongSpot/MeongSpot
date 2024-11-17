import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUserFriends } from 'react-icons/fa';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import GroupChatOptionModal from '@/components/chat/GroupChatOptionModal';
import { MyMeeting } from '@/types/meetup';

interface MyRoomListCardProps {
  meeting: MyMeeting;
}

const MyRoomListCard: React.FC<MyRoomListCardProps> = ({ meeting }) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedMeeting, setSelectedMeeting] = React.useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const openModal = (meetingId: number) => {
    setSelectedMeeting(meetingId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMeeting(null);
    setIsModalOpen(false);
  };

  return (
    <div
      key={meeting.meetingId}
      onClick={() => navigate(`/chat/group/${meeting.chatRoomId}`, { state: { roomId: meeting.chatRoomId, groupName: meeting.title }})}
      className="bg-white p-4 rounded-lg shadow cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">{meeting.title}</h2>
        {location.pathname.includes('/mymeetuproom') && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal(meeting.meetingId);
            }}
            className="text-gray-500 z-10"
          >
            <BiDotsVerticalRounded size={24} />
          </button>
        )}
      </div>
      <p className="text-sm text-gray-500 mt-1">
        {new Date(meeting.meetingAt).toLocaleDateString()} | {meeting.spotName}
      </p>
      <div className="flex items-center justify-between text-sm text-gray-700 mt-2">
        <div className="flex items-center">
          <FaUserFriends className="mr-1" />
          <span>
            {meeting.participants}/{meeting.maxParticipants}
          </span>
        </div>
        {meeting.unreadMessageCnt > 0 && (
          <div className="bg-deep-coral text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
            {meeting.unreadMessageCnt}
          </div>
        )}
      </div>
      <div className="flex flex-wrap mt-2 space-x-2">
        {meeting.hashtags.map((tag, index) => (
          <span
            key={index}
            className="text-xs text-deep-coral bg-cream-bg px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {isModalOpen && (
        <GroupChatOptionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          chatName={meeting.title}
          chatRoomId={meeting.chatRoomId}
          meetingId={meeting.meetingId}
        />
      )}
    </div>
  );
};

export default MyRoomListCard;
