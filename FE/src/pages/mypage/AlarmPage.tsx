import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import MascotDog from '@/components/common/Logo/Mascot';
import { IoChevronBack } from 'react-icons/io5';
import { NotificationInfo } from '@/types/notification';
import FriendAcceptModal from '@/components/mypage/FriendAcceptModal';

const AlarmPage = () => {
  const navigate = useNavigate();

  const [notificationList, setNotificationList] = useState<NotificationInfo[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationInfo | null>(null);

  useEffect(() => {
    // fetchNotificationList().then((res) => {
    //   if (res.status === 200) {
    //     setNotificationList(res.data);
    //   }
    // });

    // 임시 데이터
    setNotificationList([
      {
        notificationId: '1',
        type: 'SCHEDULE',
        dogImage: null,
        content: '우리지금멍나 모임 1시간전 입니다.',
        createdAt: '2024.10.18',
        timeElapsed: '이틀 전',
        isRead: false,
      },
      {
        notificationId: '2',
        type: 'FRIEND_WALK_INFO',
        dogImage: null,
        content: '깜자님이 산책을 시작하였습니다.',
        createdAt: '2024.10.20',
        timeElapsed: '7시간 전',
        isRead: false,
      },
      {
        notificationId: '3',
        type: 'FRIEND_INVITE',
        dogImage: null,
        content: '코깅님이 친구요청을 하였습니다.',
        createdAt: '2024.10.20',
        timeElapsed: '1시간 전',
        isRead: false,
        friendId: 2,
      },
    ]);
  }, []);

  const handleNotificationClick = (notification: NotificationInfo) => {
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

      {notificationList.length > 0 ? (
        <div className="p-4">
          {notificationList.map((notification) => (
            <div
              key={notification.notificationId}
              className="flex items-center justify-between py-4 border-b border-zinc-300"
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex items-center space-x-4">
                <img
                  onClick={() => notification.type === 'FRIEND_INVITE' && handleProfileClick(notification.friendId)}
                  className="rounded-full bg-gray-200 p-2 w-12 h-12"
                  src={notification.dogImage ?? undefined}
                  alt="반려견 프로필 사진"
                />

                <div className="space-y-2">
                  <p className="font-medium">{notification.content}</p>
                  <p className="text-xs text-zinc-500">{notification.timeElapsed}</p>
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
