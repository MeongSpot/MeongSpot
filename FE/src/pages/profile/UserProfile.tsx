import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, useOutletContext, useLocation } from 'react-router-dom';
import MyDogInfoCard from '@/components/mypage/MyDogInfoCard';
import { IoChevronBack } from 'react-icons/io5';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import '../../css/swiper.css';
import { Pagination } from 'swiper/modules';
import { useProfile } from '@/hooks/profile/useProfile';
import { useDog } from '@/hooks/dog/useDog';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import FriendsDeleteModal from '@/components/friends/FriendsDeleteModal';
import { useFriend } from '@/hooks/friend/useFriend';
import useSingleChatCreate from '@/hooks/chat/useSingleChatCreate';

const UserProfile: React.FC = () => {
  const { id, where } = useParams();
  const location = useLocation();
  const meetingId = (location.state as { meetingId?: number })?.meetingId;
  const navigate = useNavigate();
  const { userData, isLoading, getUserProfile } = useProfile();
  const { userDogs, getUserDogs } = useDog();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { deleteFriend, requestFriend, requestFriendResponse, isRequestFriendModalOpen, setIsRequestFriendModalOpen } = useFriend();
  const { createChatRoom, loading: chatLoading, error: chatError, chatRoomData } = useSingleChatCreate();

  const handleDeleteFriend = useCallback(
    (friendId: number) => {
      deleteFriend(friendId);
      setIsDeleteModalOpen(false);
      getUserProfile(Number(id));
    },
    [deleteFriend, getUserProfile, id],
  );

  const handleRequestFriend = useCallback(() => {
    requestFriend(Number(id));
    getUserProfile(Number(id));
  }, [requestFriend, getUserProfile, id]);

  useEffect(() => {
    getUserProfile(Number(id));
    getUserDogs(Number(id));
  }, [id]);

  useEffect(() => {
    if (chatRoomData) {
      navigate(`/chat/single/${chatRoomData}`, { state: { roomId: chatRoomData, friendName: userData?.nickname } });
    }
  }, [chatRoomData, navigate, userData]);

  if (isLoading || chatLoading) {
    return <LoadingOverlay message="로딩 중..." />;
  }

  if (!userData || !userDogs) {
    return null;
  }

  if (isLoading) {
    return <LoadingOverlay message="로딩 중..." />;
  }

  if (!userData || !userDogs) {
    return null;
  }

  return (
    <div className="pb-16">
      <div className="w-full p-4 grid grid-cols-3 items-center">
        <IoChevronBack
          onClick={() => {
            if (where === 'meetingparticipants') {
              navigate(`/meetupdoglist/${meetingId}`, { state: { animateBack: true } });
            } else {
              navigate(-1);
            }
          }}
          className="text-2xl text-zinc-700"
        />
        <h1 className="text-center text-lg font-bold">프로필</h1>
      </div>

      <hr />

      <div className="p-4 flex flex-col space-y-8">
        <div className="flex flex-col space-y-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full border flex justify-center items-center">
                <img
                  className="w-full h-full rounded-full object-cover"
                  src={userData.profileImage || '/icons/favicon/favicon-96x96.png'}
                  alt=""
                />
              </div>
              <p className="font-bold text-lg">{userData.nickname}</p>
            </div>
          </div>

          <div className="pb-2 px-1 grid grid-cols-2">
            <div className="flex justify-around items-center border-r border-zinc-300">
              <p className="text-sm font-semibold">성별</p>
              <p className="text-sm text-zinc-700">{userData.gender === 'MALE' ? '남성' : '여성'}</p>
            </div>
            <div className="flex justify-around items-center">
              <p className="text-sm font-semibold">나이</p>
              <p className="text-sm text-zinc-700">{userData.age ? `${userData.age}세` : '정보 없음'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 items-center gap-4">
            {userData.isFriend === false ? (
              <button onClick={handleRequestFriend} className="p-3 h-11 bg-deep-coral rounded-3xl">
                <p className="text-white text-sm font-semibold">친구 신청</p>
              </button>
            ) : (
              <button onClick={() => setIsDeleteModalOpen(true)} className="p-3 h-11 bg-deep-coral rounded-3xl">
                <p className="text-white text-sm font-semibold">친구 삭제</p>
              </button>
            )}
            <button
              onClick={() => createChatRoom(Number(id))}
              className="flex justify-center items-center space-x-3 p-3 h-11 bg-zinc-600 rounded-3xl"
            >
              <IoChatbubbleEllipsesOutline className="text-white font-bold" size={25} />
              <p className="text-white text-sm font-semibold">1:1 채팅</p>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 bg-cream-bg space-y-4">
        <div className="flex justify-between">
          <p className="font-semibold">반려견 정보</p>
        </div>

        {userDogs.length === 0 ? (
          <div className="h-32 flex items-center justify-center">
            <div className="text-center text-zinc-500">등록된 반려견이 없습니다</div>
          </div>
        ) : (
          <div>
            <Swiper
              pagination={{
                dynamicBullets: true,
              }}
              modules={[Pagination]}
              className="dogSwiper rounded-lg"
            >
              {userDogs.map((dog, idx) => (
                <SwiperSlide key={idx}>
                  <MyDogInfoCard dog={dog} isOwnProfile={false} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>

      <div className="bg-zinc-100 w-full h-3"></div>

      {/* 친구 요청 상태 모달 */}
      {isRequestFriendModalOpen && (
        <div className="p-5 fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white py-9 h-44 rounded-lg shadow-lg w-full flex flex-col items-center space-y-10">
            <p className="font-medium">{requestFriendResponse}</p>
            <button
              onClick={() => setIsRequestFriendModalOpen(false)}
              className="bg-deep-coral text-white px-4 py-2 rounded-lg"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <FriendsDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => handleDeleteFriend(Number(id))}
          isProfile={true}
        />
      )}
    </div>
  );
};

export default UserProfile;
