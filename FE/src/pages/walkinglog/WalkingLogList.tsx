import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const WalkingLogList = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <div className="p-4 grid grid-cols-3 items-center">
          <IoChevronBack onClick={() => navigate('/mypage')} size={24} />
          <p className="text-center text-lg font-bold">산책 기록</p>
        </div>
        <hr />
      </div>

      <div className="p-4">
        <div className="space-y-3">
          <p className="font-semibold">이번달 통계</p>
          <div className="flex flex-col justify-center items-center space-y-5">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 border rounded-full">
                <img src="" alt="" />
              </div>
              <p className="mt-2 font-semibold">뽀삐</p>
            </div>

            <div className="w-full grid grid-cols-3 items-center">
              <div className="flex flex-col justify-center items-center">
                <p className="text-sm text-zinc-500">산책 횟수</p>
                <p className="text-zinc-800 font-semibold">15회</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <p className="text-sm text-zinc-500">산책 거리</p>
                <p className="text-zinc-800 font-semibold">30Km</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <p className="text-sm text-zinc-500">산책 시간</p>
                <p className="text-zinc-800 font-semibold">10시간 40분</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-cream-bg flex-grow">
        <div className="space-y-3">
          <p className="font-semibold">최근 산책</p>
          <p className="text-sm text-zinc-600">2024년 10월</p>
          <div
            onClick={() => navigate('/walkinglog/1')}
            className="bg-white py-4 px-4 rounded-xl flex flex-col justify-center">
            <p className="mb-2 text-sm text-zinc-800">2024.10.23</p>
            <div className="space-y-5">
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 border rounded-full">
                  <img src="" alt="" />
                </div>
                <p className="mt-2 font-semibold">뽀삐</p>
              </div>

              <div className="w-full grid grid-cols-3 items-center">
                <div className="flex flex-col justify-center items-center">
                  <p className="text-sm text-zinc-500">산책 횟수</p>
                  <p className="text-zinc-800 font-semibold">15회</p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <p className="text-sm text-zinc-500">산책 거리</p>
                  <p className="text-zinc-800 font-semibold">30Km</p>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <p className="text-sm text-zinc-500">산책 시간</p>
                  <p className="text-zinc-800 font-semibold">10시간 40분</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalkingLogList;
