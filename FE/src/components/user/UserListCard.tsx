import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { div } from 'framer-motion/client';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import MascotDog from '@/components/common/Logo/Mascot';
import useSingleChatCreate from '@/hooks/chat/useSingleChatCreate';
import { FriendListInfo } from '@/types/friend';
import { UserSearchInfo } from '@/types/user';

interface FriendsListCardProps {
  data: UserSearchInfo[] | null;
  handleClick: (user: UserSearchInfo) => void;
}

const UserListCard = ({ data, handleClick }: FriendsListCardProps) => {
  const navigate = useNavigate();
  const { createChatRoom, chatRoomData, loading: chatLoading } = useSingleChatCreate();
  const [selectedFriend, setSelectedFriend] = useState<UserSearchInfo | null>(null);

  useEffect(() => {
    if (chatRoomData && selectedFriend) {
      navigate(`/chat/single/${chatRoomData}`, {
        state: { roomId: chatRoomData, friendName: selectedFriend.nickname },
      });
      setSelectedFriend(null); // 상태 초기화
    }
  }, [chatRoomData, selectedFriend, navigate]);

  const handleChatClick = async (friend: UserSearchInfo) => {
    setSelectedFriend(friend);
    await createChatRoom(friend.id);
  };

  if (!data) return null;

  return (
    <div className="">
      {data.length > 0 ? (
        data.map((friend) => (
          <div
            onClick={() => {
              handleClick(friend);
            }}
            key={friend.id}
            className="py-4 border-b border-zinc-300"
          >
            <div className="flex justify-between items-center">
              {/* 프로필 이미지와 닉네임 */}
              <div className="flex items-center">
                <div className="w-11 h-11 border rounded-full flex justify-center items-center">
                  {friend.profileImage ? (
                    <img
                      className="w-9 h-9 rounded-full object-cover"
                      src={friend.profileImage}
                      alt={`${friend.nickname}의 프로필 사진`}
                    />
                  ) : (
                    <img className="w-9 h-9" src="/icons/userIcon.png" alt="기본 프로필 이미지" />
                  )}
                </div>
                <p className="font-semibold text-sm pl-3 pr-2">{friend.nickname}</p>

                {/* 강아지 정보 */}
                {friend.dogNameList.length > 0 && (
                  <div className="flex space-x-1 items-center">
                    <p className="mr-1">|</p>
                    <p className="text-sm text-deep-coral font-medium">
                      {friend.dogNameList[0]}
                      {friend.dogNameList.length > 1 && ` 외 ${friend.dogNameList.length - 1}마리`}
                    </p>
                    <p className="text-sm text-zinc-600">견주</p>
                  </div>
                )}
              </div>

              {/* 채팅 아이콘 */}
              <IoChatbubbleEllipsesOutline
                className="text-zinc-600 mr-1"
                size={25}
                onClick={(e) => {
                  e.stopPropagation(); // 부모의 onClick 이벤트 방지
                  handleChatClick(friend);
                }}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center mt-[-10vh]">
          <div className="flex flex-col justify-center items-center h-64 text-gray-500">
            <div className="rounded-full bg-gray-200 p-4 mb-4">
              <MascotDog className="w-16 h-16 grayscale" />
            </div>
            <p className="text-sm">검색된 유저가 없습니다</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserListCard;
