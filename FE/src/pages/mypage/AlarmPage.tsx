import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MascotDog from '@/components/common/Logo/Mascot';
import { IoChevronBack, IoCloseOutline } from 'react-icons/io5';
import { FiX } from 'react-icons/fi';
import { Notification } from '@/types/alarm';
import FriendAcceptModal from '@/components/mypage/FriendAcceptModal';
import useFetchAlarm from '@/hooks/alarm/useFetchAlarm';
import useDeleteAlram from '@/hooks/alarm/useDeleteAlram';
import useMarkAlarmAsRead from '@/hooks/alarm/useMarkAlarmAsRead';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';

const AlarmPage = () => {
  const navigate = useNavigate();
  const { notifications: initialNotifications = [], loading, error } = useFetchAlarm(); // 초기 알림 목록 가져오기
  const { deleteNotification, loading: deleteLoading, error: deleteError } = useDeleteAlram();
  const { markAsRead } = useMarkAlarmAsRead();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
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

  const handleDeleteNotification = async (notificationId: number) => {
    await deleteNotification(notificationId);
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.notificationId !== notificationId),
    );
  };

  const handleBackButtonClick = async () => {
    try {
      // 모든 알림을 읽음 처리
      for (const notification of notifications) {
        await markAsRead(notification.notificationId);
        console.log(`알림 ID ${notification.notificationId}가 읽음으로 처리되었습니다.`);
      }
      navigate(-1);
    } catch (error) {
      console.error("알림 읽음 처리 중 오류:", error);
    }
  };

  useEffect(() => {
    setNotifications(initialNotifications);
    console.log('배열',initialNotifications)
  }, [initialNotifications]);

  return (
    <div className="">
      <div className="p-4">
        <div className="grid grid-cols-3 items-center">
          <IoChevronBack onClick={handleBackButtonClick} size={24} />
          <h1 className="text-center text-lg font-bold">알림</h1>
        </div>
      </div>
      <hr />

      {loading ? (
        <div className="flex justify-center items-center min-h-screen">로딩 중...</div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>
      ) : notifications.length > 0 ? ( // 알림 목록이 있는 경우
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
                  src={notification.profileImage || '/icons/favicon/favicon-96x96.png'}
                  alt="반려견 프로필 사진"
                />

                <div className="space-y-2">
                  <p className="font-medium">{notification.content}</p>
                  <p className="text-xs text-zinc-500">{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: ko })}</p>
                </div>
              </div>

              {notification.type !== 'FRIEND_INVITE' && ( // FRIEND_INVITE가 아닌 경우에만 아이콘 표시
                <FiX
                  onClick={(e) => {
                    e.stopPropagation(); // 클릭 시 알림 클릭 이벤트가 실행되지 않도록 막기
                    handleDeleteNotification(notification.notificationId);
                  }}
                  size={24}
                  className="text-red-500 cursor-pointer"
                />
              )}
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
        setNotifications={setNotifications}
      />
    </div>
  );
};

export default AlarmPage;
