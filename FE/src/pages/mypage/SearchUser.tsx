import { useState, useCallback, useEffect } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import UserSearchBar from '@/components/mypage/UserSearchBar';
import { UserSearchInfo } from '@/types/user';
import UserListCard from '@/components/user/UserListCard';
import { useUser } from '@/hooks/user/useUser';
import UserModal from '@/components/user/UserModal';
import LoadingOverlay from '@/components/common/LoadingOverlay';

const SearchUser: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchInfo | null>(null);
  const { isLoading, searchedUser, searchUser } = useUser();

  const handleSearch = useCallback(
    (query: string) => {
      searchUser(query); // 검색어를 기준으로 searchUser 함수 호출
    },
    [searchUser],
  );

  const handleUserClick = useCallback((user: UserSearchInfo) => {
    setSelectedUser(user);
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
      <div className="sticky top-0 z-30 bg-white">
        <div className="p-4 grid grid-cols-3 items-center">
          <IoChevronBack onClick={() => navigate('/friendslist')} size={24} />
          <p className="text-center text-lg font-bold">유저 검색</p>
        </div>
        <hr />
      </div>

      <div className="mt-2 p-4 space-y-4">
        <UserSearchBar onSearch={handleSearch} />

        <UserListCard data={searchedUser} handleClick={handleUserClick} />
      </div>

      <UserModal isOpen={isModalOpen} onClose={handleCloseModal} user={selectedUser} />
    </div>
  );
};

export default SearchUser;
