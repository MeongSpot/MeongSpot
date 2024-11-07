import React, { useState } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { IoMdSearch } from 'react-icons/io';
import FriendsListCard from '@/components/mypage/FriendsListCard';
import SearchBar from '@/components/common/SearchBar';

const FriendsList: React.FC = () => {
  const navigate = useNavigate();

  const [myFriendsList, setMyFriendsList] = useState([
    {
      id: 1,
      name: '뽀삐언니',
      profile_image: null,
      dogs: ['뽀삐', '쿠키', '카트시'],
    },
    {
      id: 2,
      name: '로나',
      profile_image: null,
      dogs: ['깜자'],
    },
    {
      id: 3,
      name: 'MochaMilk',
      profile_image: null,
      dogs: ['모카', '우유'],
    },
  ]);

  const [filteredFriendsList, setFilteredFriendsList] = useState(myFriendsList);

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
        <SearchBar placeholder="친구 검색" data={myFriendsList} setData={setFilteredFriendsList} filterField="name" />
        <FriendsListCard data={filteredFriendsList} />
      </div>
    </div>
  );
};

export default FriendsList;
