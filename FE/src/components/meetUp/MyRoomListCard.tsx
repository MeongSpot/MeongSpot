import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUserFriends } from 'react-icons/fa';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import GroupChatOptionModal from '@/components/chat/GroupChatOptionModal';
import { useMyMeeting } from '@/hooks/meetup/useMyMeeting';

const MyRoomListCard: React.FC = () => {
  const { meetings, loading, error } = useMyMeeting();
  const [selectedMeeting, setSelectedMeeting] = React.useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const openModal = (meetingId: number) => {
    setSelectedMeeting(meetingId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMeeting(null);
    setIsModalOpen(false);
  };

  // if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <div
          key={meeting.meetingId}
          onClick={() => navigate(`/chat/group/${meeting.chatRoomId}`)}
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
          <div className="flex items-center text-sm text-gray-700 mt-2">
            <FaUserFriends className="mr-1" />
            <span>
              {meeting.participants}/{meeting.maxParticipants}
            </span>
          </div>
          <div className="flex flex-wrap mt-2 space-x-2">
            {meeting.hashtag.map((tag, index) => (
              <span
                key={index}
                className="text-xs text-deep-coral bg-cream-bg px-2 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
      {isModalOpen && selectedMeeting && (
        <GroupChatOptionModal
          isOpen={isModalOpen}
          onClose={closeModal}
          chatName={meetings.find((m) => m.meetingId === selectedMeeting)?.title || ''}
          chatRoomId={selectedMeeting}
        />
      )}
    </div>
  );
};

export default MyRoomListCard;
