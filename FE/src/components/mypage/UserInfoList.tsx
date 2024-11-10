import { useNavigate } from 'react-router-dom';
import { PiNotePencil } from 'react-icons/pi';
import { UserMyPageInfo } from '@/types/user';

interface UserInfoListProps {
  userData: UserMyPageInfo | null;
}

const UserInfoList = ({ userData }: UserInfoListProps) => {
  const navigate = useNavigate();
  const userInfo = ['이름', '성별', '나이'];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full border flex justify-center items-center">
            {userData?.profileImage ? (
              <img className="w-full h-full rounded-full object-cover" src={userData.profileImage} alt="" />
            ) : (
              <img className="w-[80%] h-[80%]" src="/icons/favicon/favicon-96x96.png" alt="" />
            )}
          </div>
          <p className="font-bold text-lg">{userData?.nickname}</p>
        </div>
        <button
          onClick={() => {
            navigate('/mypage/update');
          }}
          className="px-2 py-[0.3rem] border rounded-3xl flex items-center space-x-1 text-xs"
        >
          <PiNotePencil className="text-lg" />
          <p>수정</p>
        </button>
      </div>

      <div className="grid grid-cols-3">
        {userInfo.map((info, idx) => (
          <div
            key={idx}
            className={`flex justify-around items-center ${idx !== userInfo.length - 1 ? 'border-r border-zinc-300' : ''}`}
          >
            <p className="text-sm font-semibold">{info}</p>
            <p className="text-sm text-zinc-700">
              {info === '이름' && userData?.name}
              {info === '성별' && (userData?.gender === 'MALE' ? '남자' : '여자')}
              {info === '나이' && userData?.age}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserInfoList;
