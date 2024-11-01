import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import { FaAngleRight } from 'react-icons/fa6';

const Settings: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="p-4">
        <div className="grid grid-cols-3 items-center">
          <IoIosArrowBack onClick={() => navigate('/mypage')} className="text-xl" />
          <p className="text-center text-lg font-bold">설정</p>
          <div></div>
        </div>
      </div>
      <hr />

      <div className="p-4">
        <div className="p-5 py-7 bg-cream-bg rounded-3xl flex justify-between">
          <p className="text-[#5a341f] font-medium">yejin123</p>
          <button className="text-[#5a341f] font-semibold">로그아웃</button>
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
