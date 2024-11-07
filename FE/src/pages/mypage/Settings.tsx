import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { FaAngleRight } from 'react-icons/fa6';
import { IoChevronBack } from 'react-icons/io5';
import { authService } from '@/services/authService';
import useAuthStore from '@/store/useAuthStore';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { useAuth } from '@/hooks/useAuth';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const { loginId } = useAuthStore();
  const { logout } = useAuth();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative">
      {isLoading && <LoadingOverlay message="로그아웃 중..." />}
      <div className="p-4">
        <div className="grid grid-cols-3 items-center">
          <IoChevronBack onClick={() => navigate('/mypage')} size={24} />
          <p className="text-center text-lg font-bold">설정</p>
          <div></div>
        </div>
      </div>
      <hr />

      <div className="p-4">
        <div className="p-5 py-7 bg-cream-bg rounded-3xl flex justify-between">
          <p className="text-[#5a341f] font-medium">{loginId}</p>
          <button 
            onClick={handleLogout}
            className="text-[#5a341f] font-semibold hover:opacity-80"
          >
            로그아웃
          </button>
        </div>

        <div className="px-1 py-8 space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-zinc-700">알림 설정</p>
            <FaAngleRight />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-zinc-700">친구 차단목록</p>
            <FaAngleRight />
          </div>
          <div className="flex justify-between items-center">
            <p className="text-zinc-700">회원탈퇴</p>
            <FaAngleRight />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;