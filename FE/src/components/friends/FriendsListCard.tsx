import { useState, useEffect } from 'react';
import { div } from 'framer-motion/client';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import MascotDog from '@/components/common/Logo/Mascot';
import { FriendListInfo } from '@/types/friend';
import useSingleChatCreate from '@/hooks/chat/useSingleChatCreate';
import { useNavigate } from 'react-router-dom';

interface Friend {
  id: number;
  nickname: string;
  profileImage: string | null;
  dogNames: string[];
}

interface FriendsListCardProps {
  data: Friend[];
  handleClick: (friend: FriendListInfo) => void;
}

const FriendsListCard = ({ data, handleClick }: FriendsListCardProps) => {
  const { createChatRoom, chatRoomData } = useSingleChatCreate();
  const navigate = useNavigate();
  const [selectedFriend, setSelectedFriend] = useState<{ id: number; nickname: string } | null>(null);

  const handleChatClick = (friendId: number, friendName: string) => {
    setSelectedFriend({ id: friendId, nickname: friendName });
    createChatRoom(friendId);
  };

  // chatRoomData 업데이트 시 네비게이트 실행
  useEffect(() => {
    if (chatRoomData && selectedFriend) {
      navigate(`/chat/single/${chatRoomData}`, { state: { roomId: chatRoomData, friendName: selectedFriend.nickname } });
      setSelectedFriend(null); // 상태 초기화
    }
  }, [chatRoomData, navigate, selectedFriend]);

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
                    <img className="w-9 h-9" src="/icons/favicon/favicon-96x96.png" alt="기본 프로필 이미지" />
                  )}
                </div>
                <p className="font-semibold text-sm pl-3 pr-2">{friend.nickname}</p>

                {/* 강아지 정보 */}
                {friend.dogNames.length > 0 && (
                  <div className="flex space-x-1 items-center">
                    <p className="mr-1">|</p>
                    <p className="text-sm text-deep-coral font-medium">
                      {friend.dogNames[0]}
                      {friend.dogNames.length > 1 && ` 외 ${friend.dogNames.length - 1}마리`}
                    </p>
                    <p className="text-sm text-zinc-600">견주</p>
                  </div>
                )}
              </div>

              {/* 채팅 아이콘 */}
              <IoChatbubbleEllipsesOutline
                className="text-zinc-600 mr-1 cursor-pointer"
                size={25}
                onClick={(e) => {
                  e.stopPropagation();
                  handleChatClick(friend.id, friend.nickname);
                }}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center mt-[-10vh]">
          <div className="flex flex-col justify-center items-center h-64 text-gray-500">
            <div className="rounded-full bg-gray-200 p-4 mb-2">
              <MascotDog className="w-16 h-16 grayscale" />
            </div>
            <p className="text-sm">등록된 친구가 없습니다</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendsListCard;
