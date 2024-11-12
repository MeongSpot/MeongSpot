import { useEffect, useState } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import MyDogInfoCard from '@/components/mypage/MyDogInfoCard';
import UserInfoList from '@/components/mypage/UserInfoList';
import { IoNotificationsOutline } from 'react-icons/io5';
import { IoAddCircle } from 'react-icons/io5';
import { IoChevronBack } from 'react-icons/io5';
import { FaAngleRight } from 'react-icons/fa6';
import { PiNotePencil } from 'react-icons/pi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SlSettings } from 'react-icons/sl';
import 'swiper/css';
import 'swiper/css/pagination';
import '../../css/swiper.css';
import { Pagination } from 'swiper/modules';
import { DogInfo } from '@/types/dogInfo';
import { useFriend } from '@/hooks/friend/useFriend';
import { useMyPage } from '@/hooks/mypage/useMyPage';
import { useDog } from '@/hooks/dog/useDog';
import { useWalkingLog } from '@/hooks/walkinglog/useWalkingLog';
import LoadingOverlay from '@/components/common/LoadingOverlay';

const MyPage: React.FC = () => {
  const { getFriends, friendsCount } = useFriend();
  const { myDogs, getMyDogs } = useDog();
  const { getWalkingLogList, monthlyWalkingLogs } = useWalkingLog();
  const [totalWalkingCount, setTotalWalkingCount] = useState(0);
  const [totalWalkingDistance, setTotalWalkingDistance] = useState(0);
  const [totalWalkingTime, setTotalWalkingTime] = useState(0);
  const { userData, getMyPageUser } = useMyPage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // 데이터 호출이 완료될 때까지 대기
        await Promise.all([getFriends(), getMyDogs(), getMyPageUser(), getWalkingLogList()]);
      } catch (error) {
        console.error('데이터를 불러오는 중 오류가 발생했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (monthlyWalkingLogs) {
      setTotalWalkingDistance(monthlyWalkingLogs.reduce((acc, cur) => acc + (cur.monthlyWalkDistance || 0), 0));
      setTotalWalkingTime(
        parseFloat((monthlyWalkingLogs.reduce((acc, cur) => acc + (cur.monthlyWalkTime || 0), 0) / 60).toFixed(2)),
      );
      setTotalWalkingCount(monthlyWalkingLogs.reduce((acc, cur) => acc + (cur.monthlyWalkCount || 0), 0));
    }
  }, [monthlyWalkingLogs]);

  return (
    <div className="pb-16">
      {isLoading ? (
        <LoadingOverlay message="로딩 중..." />
      ) : (
        <>
          <div className="w-full p-4 grid grid-cols-3 items-center">
            <div></div>
            <h1 className="text-center text-lg font-bold">마이페이지</h1>
            <div className="w-full flex justify-end items-center space-x-4">
              <IoNotificationsOutline
                onClick={() => {
                  navigate('/notification');
                }}
                className="text-2xl text-zinc-700"
              />
              <SlSettings
                onClick={() => {
                  navigate('/settings');
                }}
                className="text-[1.35rem] text-zinc-700"
              />
            </div>
          </div>

          <hr />

          <div className="p-4 flex flex-col space-y-8">
            <div className="flex flex-col space-y-5">
              <UserInfoList userData={userData} />

              <hr />
              <div onClick={() => navigate('/friendslist')} className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-zinc-500">나의 친구</p>
                  <p className="font-semibold">{friendsCount}</p>
                </div>
                <button
                  onClick={(e) => {
                    navigate('/searchuser');
                    e.stopPropagation();
                  }}
                  className="p-2 px-3 bg-deep-coral rounded-3xl"
                >
                  <p className="text-white text-sm">친구찾기</p>
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-cream-bg space-y-4">
            <div className="flex justify-between">
              <p className="font-semibold">반려견 정보</p>

              <div
                onClick={() => {
                  navigate('/registerdog');
                }}
                className="flex items-center space-x-1"
              >
                <p className="font-medium text-sm text-[#f7824c]">반려견 등록</p>
                <IoAddCircle className="text-xl text-deep-coral" />
              </div>
            </div>

            {myDogs.length === 0 ? (
              <div className="flex flex-col justify-center items-center h-48 space-y-4">
                <img className="w-20 h-20" src="/icons/sadDogIcon.svg" alt="슬픈강아지아이콘" />
                <div className="flex flex-col items-center">
                  <p className="text-gray-600">등록된 반려견이 없습니다.</p>
                  <p className="text-sm text-[#a5a5a5]">먼저 나의 반려견을 등록해보세요</p>
                </div>
              </div>
            ) : (
              <div>
                <Swiper
                  pagination={{
                    dynamicBullets: true,
                  }}
                  modules={[Pagination]}
                  className="dogSwiper rounded-lg"
                >
                  {myDogs.map((dog, idx) => (
                    <SwiperSlide key={idx}>
                      <MyDogInfoCard dog={dog} isOwnProfile={true} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>

          <div className="bg-zinc-100 w-full h-3"></div>

          <div className="p-4 pb-10 flex flex-col space-y-5">
            <div
              onClick={() => {
                navigate('/walkinglog');
              }}
              className="flex items-center justify-between"
            >
              <p className="font-semibold">산책 기록</p>
              <div className="flex items-center space-x-1 text-zinc-700">
                <FaAngleRight className="" />
              </div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-zinc-300">
              <div className="flex flex-col justify-center items-center space-y-2">
                <div className="flex items-end space-x-1">
                  <p className="text-[1.4rem] font-extrabold">{totalWalkingCount}</p>
                </div>
                <p className="text-xs text-zinc-700">이번달 산책 횟수</p>
              </div>
              <div className="flex flex-col justify-center items-center space-y-2">
                <div className="flex items-end space-x-1">
                  <p className="text-[1.4rem] font-extrabold">{totalWalkingDistance.toFixed(2)}</p>
                  <p className="text-xs text-zinc-600">km</p>
                </div>
                <p className="text-xs text-zinc-700">이번달 산책 거리</p>
              </div>
              <div className="flex flex-col justify-center items-center space-y-2">
                <div className="flex items-end space-x-1">
                  <p className="text-[1.4rem] font-extrabold">{totalWalkingTime}</p>
                  <p className="text-xs text-zinc-600">h</p>
                </div>
                <p className="text-xs text-zinc-700">이번달 산책 시간</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MyPage;
