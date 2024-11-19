import React from 'react';
import { IoMdSearch } from 'react-icons/io';
import { UserInfo } from '@/types/user';
import { useUser } from '@/hooks/user/useUser';

interface UserSearchBarProps {
  onSearch: (query: string) => void;
}

const UserSearchBar = ({onSearch}: UserSearchBarProps) => {
  const [searchText, setSearchText] = React.useState<string>('');

  const handleSearch = () => {
    onSearch(searchText);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-3 border border-zinc-400 rounded-md flex items-center">
      <input
        onChange={(e) => setSearchText(e.target.value)}
        value={searchText}
        className="focus:outline-none w-full"
        type="text"
        placeholder="유저 닉네임을 입력해주세요"
        onKeyDown={handleKeyDown}
      />
      <IoMdSearch className="text-2xl text-zinc-500 cursor-pointer" onClick={handleSearch} />
    </div>
  );
};

export default UserSearchBar;
