import { useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import MyDogInfoCard from '@/components/mypage/MyDogInfoCard';
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
import { is } from 'date-fns/locale';

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const userInfo = ['이름', '성별', '나이'];
  const myId = 1; // 가상의 유저 아이디로 설정
  const isOwnProfile = Number(userId) === myId;
  const { setShowNav } = useOutletContext<{ setShowNav: React.Dispatch<React.SetStateAction<boolean>> }>();

  const dogInfoList: DogInfo[] = [
    {
      profile_image: 'url-to-image1.jpg',
      name: '뽀삐',
      breedId: '시바견',
      age: 3,
      birth: {
        year: '2018',
        month: '01',
        day: '01',
      },
      size: '소형견',
      gender: '수컷',
      isNeuter: true,
      introduction: '안녕하세요',
      personality: [1, 2, 3], // 가상의 성격 아이디로 설정
    },
    {
      profile_image: 'url-to-image2.jpg',
      name: '쿠키',
      breedId: '말티즈',
      age: 3,
      birth: {
        year: '2018',
        month: '01',
        day: '01',
      },
      size: '소형견',
      gender: '암컷',
      isNeuter: false,
      introduction: '안녕하세요',
      personality: [1, 2, 3], // 동일하게 가상의 성격 아이디 사용
    },
  ];

  useEffect(() => {
    // 본인 프로필이 아니면 Nav를 숨김
    setShowNav(Number(userId) === myId);
    return () => setShowNav(true); // 컴포넌트 언마운트 시 Nav를 다시 보이게 함
  }, [userId, myId, setShowNav]);

  return (
    <div className="pb-16">
      {isOwnProfile ? (
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
      ) : (
        <div className="w-full p-4 grid grid-cols-3 items-center">
          <IoChevronBack
            onClick={() => {
              navigate(-1);
            }}
            className="text-2xl text-zinc-700"
          />
          <h1 className="text-center text-lg font-bold">프로필</h1>
        </div>
      )}
      <hr />

      <div className="p-4 flex flex-col space-y-8">
        <div className="flex flex-col space-y-5">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-full border flex justify-center items-center">
                <img className="w-[80%] h-[80%]" src="/icons/favicon/favicon-96x96.png" alt="" />
              </div>
              <p className="font-bold text-lg">뽀삐 주인</p>
            </div>
            {isOwnProfile ? (
              <PiNotePencil className="text-2xl" />
            ) : (
              <div>
                <button className="p-2 px-3 bg-deep-coral rounded-3xl">
                  <p className="text-white text-sm">친구 신청</p>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3">
            {userInfo.map((info, idx) => (
              <div key={idx} className="flex justify-around items-center">
                <p className="text-sm font-semibold">{info}</p>
                <p className="">정보</p>
              </div>
            ))}
          </div>

          {isOwnProfile && (
            <>
              <hr />
              <div onClick={() => navigate('/friendslist')} className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-zinc-500">나의 친구</p>
                  <p className="font-semibold">5</p>
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
            </>
          )}
        </div>
      </div>

      <div className="p-4 bg-cream-bg space-y-4">
        <div className="flex justify-between">
          <p className="font-semibold">반려견 정보</p>
          {isOwnProfile && (
            <div
              onClick={() => {
                navigate('/registerdog');
              }}
              className="flex items-center space-x-1"
            >
              <p className="font-medium text-sm text-[#f7824c]">반려견 등록</p>
              <IoAddCircle className="text-xl text-deep-coral" />
            </div>
          )}
        </div>

        <div>
          <Swiper
            pagination={{
              dynamicBullets: true,
            }}
            modules={[Pagination]}
            className="dogSwiper rounded-lg"
          >
            {dogInfoList.map((dog, idx) => (
              <SwiperSlide key={idx}>
                <MyDogInfoCard dog={dog} isOwnProfile={isOwnProfile} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className="bg-zinc-100 w-full h-3"></div>

      {isOwnProfile && (
        <div className="p-4 flex flex-col space-y-5">
          <div className="flex items-center justify-between">
            <p className="font-semibold">산책 기록</p>
            <div className="flex items-center space-x-1 text-zinc-700">
              <FaAngleRight className="" />
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-zinc-300">
            <div className="flex flex-col justify-center items-center space-y-2">
              <div className="flex items-end space-x-1">
                <p className="text-2xl font-extrabold">15</p>
              </div>
              <p className="text-xs text-zinc-700">이번달 산책 횟수</p>
            </div>
            <div className="flex flex-col justify-center items-center space-y-2">
              <div className="flex items-end space-x-1">
                <p className="text-2xl font-extrabold">30</p>
                <p className="text-xs text-zinc-600">km</p>
              </div>
              <p className="text-xs text-zinc-700">이번달 산책 거리</p>
            </div>
            <div className="flex flex-col justify-center items-center space-y-2">
              <div className="flex items-end space-x-1">
                <p className="text-2xl font-extrabold">10</p>
                <p className="text-xs text-zinc-600">h</p>
              </div>
              <p className="text-xs text-zinc-700">이번달 산책 시간</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
