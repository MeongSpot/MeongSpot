import React, { useEffect, useState } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { IoMdSearch } from 'react-icons/io';
import FriendsListCard from '@/components/mypage/FriendsListCard';
import SearchBar from '@/components/common/SearchBar';
import { useFriend } from '@/hooks/friend/useFriend';
import { set } from 'lodash';

const FriendsList: React.FC = () => {
  const navigate = useNavigate();
  const { friendsList, getFriends, filteredFriendsList, setFilteredFriendsList } = useFriend();

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <div className="space-y-2">
      <div>
        <div className="p-4 grid grid-cols-3 items-center">
          <IoChevronBack onClick={() => navigate('/mypage')} size={24} />
          <p className="text-center text-lg font-bold">친구 목록</p>
        </div>
        <hr />
      </div>

      <div className="p-4 space-y-3">
        <SearchBar placeholder="친구 검색" data={friendsList} setData={setFilteredFriendsList} filterField="nickname" />
        <FriendsListCard data={filteredFriendsList} />
      </div>
    </div>
  );
};

export default FriendsList;
