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
import FriendsRequestModal from '@/components/friends/FriendsRequestModal';

const UserProfile: React.FC = () => {
  const { id, where } = useParams();
  const location = useLocation();
  const { dogId } = location.state || {}; // 전달된 dogId 가져오기
  const meetingId = (location.state as { meetingId?: number })?.meetingId;
  const fromList = (location.state as { fromList?: boolean })?.fromList;
  const fromModal = (location.state as { fromModal?: boolean })?.fromModal;
  const previousPath = (location.state as { previousPath?: string })?.previousPath;
  const spotName = (location.state as { spotName?: string })?.spotName;
  const navigate = useNavigate();
  const { userData, isLoading, getUserProfile } = useProfile();
  const { userDogs, getUserDogs } = useDog();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { deleteFriend, requestFriend, requestFriendResponse, isRequestFriendModalOpen, setIsRequestFriendModalOpen } =
    useFriend();
  const { createChatRoom, loading: chatLoading, error: chatError, chatRoomData } = useSingleChatCreate();
  const [initialSlideIndex, setInitialSlideIndex] = useState(0);
  const [isDogsLoaded, setIsDogsLoaded] = useState(false);

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
    if (chatRoomData) {
      navigate(`/chat/single/${chatRoomData}`, { state: { roomId: chatRoomData, friendName: userData?.nickname } });
    }
  }, [chatRoomData, navigate, userData]);

  useEffect(() => {
    getUserProfile(Number(id));
    getUserDogs(Number(id));
  }, [id]);

  // dogId를 기준으로 초기 슬라이드 인덱스 설정
  useEffect(() => {
    if (dogId && userDogs.length > 0) {
      const index = userDogs.findIndex((dog) => dog.id === dogId);
      setInitialSlideIndex(index >= 0 ? index : 0);
      setIsDogsLoaded(true); // 강아지 데이터 로드 완료
    }
  }, [dogId, userDogs]);

  if (isLoading || !isDogsLoaded) {
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
              navigate(`/meetupdoglist/${meetingId}`, {
                state: { animateBack: true, fromList, fromModal, previousPath, spotName },
              });
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

          {userData.isMe === false && (
            <div className="grid grid-cols-2 items-center space-x-2">
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
          )}
        </div>
      </div>

      <div className="p-4 bg-cream-bg space-y-4">
        <div className="flex justify-between">
          <p className="font-semibold">반려견 정보</p>
        </div>

        {userDogs.length === 0 ? (
          <div className="h-32 flex flex-col items-center justify-center">
            <img className="w-16 h-16 mb-4" src="/icons/sadDogIcon.svg" alt="슬픈강아지아이콘" />
            <div className="text-center text-zinc-500">등록된 반려견이 없습니다</div>
          </div>
        ) : (
          <Swiper
            pagination={{
              dynamicBullets: true,
            }}
            modules={[Pagination]}
            className="dogSwiper rounded-lg"
            initialSlide={initialSlideIndex} // 초기 슬라이드 설정
          >
            {userDogs.map((dog, idx) => (
              <SwiperSlide key={dog.id}>
                <MyDogInfoCard dog={dog} isOwnProfile={false} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      <div className="bg-zinc-100 w-full h-3"></div>

      {/* 친구 요청 상태 모달 */}
      {isRequestFriendModalOpen && (
        <FriendsRequestModal
          requestFriendResponse={requestFriendResponse}
          setIsRequestFriendModalOpen={setIsRequestFriendModalOpen}
        />
      )}

      {isDeleteModalOpen && (
        <FriendsDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => handleDeleteFriend(Number(id))}
        />
      )}
    </div>
  );
};

export default UserProfile;
