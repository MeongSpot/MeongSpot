import React, { useEffect, useState, useCallback } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { IoMdSearch } from 'react-icons/io';
import FriendsListCard from '@/components/friends/FriendsListCard';
import SearchBar from '@/components/common/SearchBar';
import { useFriend } from '@/hooks/friend/useFriend';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import FriendsModal from '@/components/friends/FriendsModal';
import { FriendListInfo } from '@/types/friend';

const FriendsList: React.FC = () => {
  const navigate = useNavigate();
  const { friendsList, getFriends, filteredFriendsList, setFilteredFriendsList, isLoading } = useFriend();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<FriendListInfo | null>(null);

  useEffect(() => {
    getFriends();
  }, []);

  const handleFriendClick = useCallback((friend: FriendListInfo) => {
    setSelectedFriend(friend);
    setIsModalVisible(true);
    setTimeout(() => {
      setIsModalOpen(true);
    }, 10);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setTimeout(() => {
      setIsModalVisible(false);
    }, 500);
  }, []);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div>
      <div>
        <div className="p-4 grid grid-cols-3 items-center">
          <IoChevronBack onClick={() => navigate('/mypage')} size={24} />
          <p className="text-center text-lg font-bold">친구 목록</p>
        </div>
        <hr />
      </div>

      <div className="mt-2 p-4 space-y-3">
        <SearchBar placeholder="친구 검색" data={friendsList} setData={setFilteredFriendsList} filterField="nickname" />
        <FriendsListCard data={filteredFriendsList} handleClick={handleFriendClick} />
      </div>

      <FriendsModal isOpen={isModalOpen} onClose={handleCloseModal} friend={selectedFriend} />
    </div>
  );
};

export default FriendsList;
