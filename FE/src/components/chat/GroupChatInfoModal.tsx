import React, { useState, useEffect } from 'react';
import { FiArrowRight, FiBellOff, FiCalendar, FiClock, FiMapPin, FiSettings, FiLogOut } from 'react-icons/fi';
import { FaBell, FaDog } from 'react-icons/fa';
import { useMeeting } from '@/hooks/meetup/useMeeting';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

interface GroupChatInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  meetingId: number;
  onDogSelectionClick: () => void;
  onLeaveChat: () => void;
}

const GroupChatInfoModal: React.FC<GroupChatInfoModalProps> = ({
  isOpen,
  onClose,
  onViewDetails,
  meetingId,
  onDogSelectionClick,
  onLeaveChat,
}) => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const { meetingDetail, hashtags, dogImages, isLoading, error, fetchMeetingDetail } = useMeeting();
  const navigate = useNavigate();
  useEffect(() => {
    if (isOpen && meetingId) {
      fetchMeetingDetail(String(meetingId));
    }
  }, [isOpen, meetingId, fetchMeetingDetail]);

  const toggleNotification = () => {
    setIsNotificationEnabled((prev) => !prev);
  };

  if (isLoading || !meetingDetail) return null;

  const meetingDate = format(new Date(meetingDetail.meetingAt), 'yyyy-MM-dd');
  const meetingTime = format(new Date(meetingDetail.meetingAt), 'a h:mm', { locale: ko });

  return (
    <div
      className={`fixed inset-0 z-20 bg-gray-800 bg-opacity-50 flex justify-end transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      onClick={onClose}
    >
      <div
        className={`transform transition-transform duration-300 ease-in-out bg-white w-4/5 max-w-md h-full p-6 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center">
            <button onClick={toggleNotification} className="mr-2">
              {isNotificationEnabled ? <FaBell /> : <FiBellOff />}
            </button>
            채팅 푸시 알림
          </h2>
          <button onClick={onClose} className="text-gray-500">
            <FiArrowRight size={24} />
          </button>
        </div>

        <hr className="my-2" />

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <FiCalendar size={18} className="text-gray-500 mr-2" />
            <span className="flex-1">날짜</span>
            <span className="text-gray-800">{meetingDate}</span>
          </div>
          <div className="flex items-center mb-2">
            <FiClock size={18} className="text-gray-500 mr-2" />
            <span className="flex-1">시간</span>
            <span className="text-gray-800">{meetingTime}</span>
          </div>
          {meetingDetail.detailLocation && (
            <div className="flex items-center mb-2">
              <FiMapPin size={18} className="text-gray-500 mr-2" />
              <span className="flex-1">상세 장소</span>
              <span className="text-gray-800">{meetingDetail.detailLocation}</span>
            </div>
          )}
        </div>

        {hashtags.length > 0 && (
          <>
            <hr className="my-2" />
            <div className="mb-4">
              <h3 className="text-gray-700 mb-2">해시태그</h3>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, index) => (
                  <span key={index} className="bg-cream-bg text-orange-600 px-2 py-1 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {meetingDetail.information && (
          <>
            <hr className="my-2" />
            <div className="mb-4">
              <h3 className="text-gray-700 mb-2">모임설명</h3>
              <p className="text-gray-600 text-sm">{meetingDetail.information}</p>
            </div>
          </>
        )}

        <hr className="my-2" />

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <h3 className="text-gray-700">참여 강아지</h3>
              <span className="text-gray-800 font-semibold">{dogImages.length}</span>
            </div>
            <button onClick={onViewDetails} className="text-sm text-gray-700">
              상세보기
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-2">
            {dogImages.map((dog, index) => (
              <div
                key={`dog-${dog.dogId}-${index}`}
                className="w-16 h-16 cursor-pointer"
                onClick={() =>
                  navigate(`/profile/${dog.memberId}`, {
                    state: { dogId: dog.dogId },
                  })
                }
              >
                <img
                  src={dog.profileImage}
                  alt={`강아지 ${index + 1}`}
                  className="w-full h-full object-cover rounded-full border border-light-orange"
                  onError={(e) => {
                    e.currentTarget.src = '/icons/favicon/favicon-96x96.png';
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full flex justify-between items-center border-t">
          <button
            className="flex-1 py-4 flex justify-center items-center space-x-2 text-gray-600 hover:text-gray-800"
            onClick={onDogSelectionClick}
          >
            <FaDog size={20} />
            <span>강아지 선택</span>
          </button>
          <div className="w-px h-6 bg-gray-300"></div>
          <button
            className="flex-1 py-4 flex justify-center items-center space-x-2 text-gray-600 hover:text-gray-800"
            onClick={onLeaveChat} // 나가기 클릭
          >
            <FiLogOut size={20} />
            <span>나가기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatInfoModal;
