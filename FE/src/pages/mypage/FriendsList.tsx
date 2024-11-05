import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { IoMdSearch } from 'react-icons/io';
import FriendsListCard from '@/components/mypage/FriendsListCard';

const FriendsList: React.FC = () => {
  const navigate = useNavigate();

  const myFriendsList = [
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
  ];

  return (
    <div className="space-y-2">
      <div>
        <div className="p-4 grid grid-cols-3 items-center">
          <IoChevronBack onClick={() => navigate('/mypage')} size={24} />
          <p className="text-center text-lg font-bold">친구 목록</p>
          <div className="flex justify-end">
            <IoMdSearch size={24} />
          </div>
        </div>
        <hr />
      </div>

      <div className="p-4">
        <FriendsListCard data={myFriendsList} />
      </div>
    </div>
  );
};

export default FriendsList;
