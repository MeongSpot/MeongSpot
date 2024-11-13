import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import MascotDog from '@/components/common/Logo/Mascot';
import { IoChevronBack } from 'react-icons/io5';
import { Notification } from '@/types/alarm';
import FriendAcceptModal from '@/components/mypage/FriendAcceptModal';
import useFetchAlarm from '@/hooks/alarm/useFetchAlarm';

const AlarmPage = () => {
  const navigate = useNavigate();
  const { notifications = [], loading, error } = useFetchAlarm(); // 기본값을 빈 배열로 설정
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const handleNotificationClick = (notification: Notification) => {
    if (notification.type === 'FRIEND_INVITE') {
      setSelectedNotification(notification);
      setIsModalOpen(true);
    }
  };

  const handleProfileClick = (friendId?: number) => {
    if (friendId) navigate(`/profile/${friendId}`);
  };

  return (
    <div className="">
      <div className="p-4">
        <div className="grid grid-cols-3 items-center">
          <IoChevronBack onClick={() => navigate('/mypage')} size={24} />
          <h1 className="text-center text-lg font-bold">알림</h1>
        </div>
      </div>
      <hr />

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">로딩 중...</div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>
      ) : notifications && notifications.length > 0 ? ( // 조건부 렌더링 추가
        <div className="p-4">
          {notifications.map((notification) => (
            <div
              key={notification.notificationId}
              className="flex items-center justify-between py-4 border-b border-zinc-300"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-center space-x-4">
                <img
                  onClick={() => notification.type === 'FRIEND_INVITE' && handleProfileClick(notification.friendId)}
                  className="rounded-full bg-gray-200 p-2 w-12 h-12"
                  src={notification.profileImage ?? undefined}
                  alt="반려견 프로필 사진"
                />

                <div className="space-y-2">
                  <p className="font-medium">{notification.content}</p>
                  <p className="text-xs text-zinc-500">{notification.createdAt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center mt-[-10vh]">
          <div className="flex flex-col justify-center items-center h-64 text-gray-500">
            <div className="rounded-full bg-gray-200 p-4 mb-2">
              <MascotDog className="w-16 h-16 grayscale" />
            </div>
            <p className="text-sm">알림 내역이 없습니다</p>
          </div>
        </div>
      )}

      <FriendAcceptModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedNotification={selectedNotification}
        setSelectedNotification={setSelectedNotification}
      />
    </div>
  );
};

export default AlarmPage;
