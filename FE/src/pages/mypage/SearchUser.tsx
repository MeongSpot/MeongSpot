import { useState } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import UserSearchBar from '@/components/mypage/UserSearchBar';
import FilteredUserList from '@/components/mypage/FilteredUserList';
import { UserInfo } from '@/types/user';

const SearchUser: React.FC = () => {
  const navigate = useNavigate();
  const [filteredResults, setFilteredResults] = useState<UserInfo[]>([]);

  return (
    <div className="space-y-4">
      <div>
        <div className="p-4 grid grid-cols-3 items-center">
          <IoChevronBack onClick={() => navigate('/mypage/1')} size={24} />
          <p className="text-center text-lg font-bold">친구 찾기</p>
        </div>
        <hr />
      </div>

      <div className="p-4 space-y-4">
        <UserSearchBar setData={setFilteredResults} />

        <FilteredUserList data={filteredResults} />
      </div>
    </div>
  );
};

export default SearchUser;
