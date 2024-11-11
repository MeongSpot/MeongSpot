import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const WalkingLogDetail = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <div className="p-4 grid grid-cols-3 items-center">
          <IoChevronBack onClick={() => navigate('/walkinglog')} size={24} />
          <p className="text-center text-lg font-bold">10월 23일</p>
        </div>
        <hr />
      </div>

      <div className="p-4 flex flex-col items-center space-y-10">
        <div className="mt-5 flex space-x-10 justify-center items-center">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-[0.15rem] rounded-3xl bg-deep-coral">
              <p className="text-white">시작</p>
            </button>
            <p className="font-medium text-zinc-600">16시 15분</p>
          </div>

          <div className="flex items-center space-x-2">
            <button className="px-3 py-[0.15rem] rounded-3xl bg-deep-coral">
              <p className="text-white">종료</p>
            </button>
            <p className="font-medium text-zinc-600">17시 42분</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="w-7 h-7 border rounded-full">
            <img src="" alt="" />
          </div>
          <p>뽀삐와 함께 산책했어요</p>
        </div>

        <div className="flex">
          <div className="px-5 flex flex-col items-center border-r border-zinc-300">
            <p className="text-sm text-zinc-800">산책 시간</p>
            <p className="text-2xl font-bold">90</p>
            <p className="text-sm text-zinc-600">분</p>
          </div>
          <div className="px-5 flex flex-col items-center">
            <p className="text-sm text-zinc-800">산책 거리</p>
            <p className="text-2xl font-bold">3.00</p>
            <p className="text-sm text-zinc-600">Km</p>
          </div>
        </div>

        <div className="w-[90%] h-64 border rounded-lg">
          <img src="" alt="" />
        </div>
      </div>
    </div>
  );
};

export default WalkingLogDetail;
