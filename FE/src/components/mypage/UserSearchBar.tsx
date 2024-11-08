import React from 'react';
import { IoMdSearch } from 'react-icons/io';
import { UserInfo } from '@/types/user';

interface UserSearchBarProps {
  setData: React.Dispatch<React.SetStateAction<UserInfo[]>>;
}

const UserSearchBar = ({ setData }: UserSearchBarProps) => {
  const handleSearch = () => {
    setData([
      {
        id: 1,
        name: '로나로나',
        profileImage: 'url-to-image1.jpg',
        dogs: ['뽀삐', '쿠키', '카트시'],
      },
      {
        id: 2,
        name: '로나',
        profileImage: 'url-to-image2.jpg',
        dogs: ['깜자'],
      },
    ]);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-3 border border-zinc-400 rounded-md flex items-center">
      <input
        className="focus:outline-none w-full"
        type="text"
        placeholder="유저 닉네임을 입력해주세요"
        onKeyDown={handleKeyDown}
      />
      <IoMdSearch className="text-2xl text-zinc-500 cursor-pointer" onClick={handleSearch} />{' '}
    </div>
  );
};

export default UserSearchBar;
