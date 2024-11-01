import React from 'react';
import MyDogInfoCard from '@/components/mypage/MyDogInfoCard';
import { IoNotificationsOutline } from 'react-icons/io5';
import { HiPencil } from 'react-icons/hi';
import { IoAddCircle } from 'react-icons/io5';
import { FaAngleRight } from 'react-icons/fa6';
import { PiNotePencil } from 'react-icons/pi';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SlSettings } from 'react-icons/sl';
import 'swiper/css';
import 'swiper/css/pagination';
import '../../css/swiper.css';
import { Pagination } from 'swiper/modules';

const MyPage: React.FC = () => {
  const userInfo = ['이름', '성별', '나이'];

  const dogInfo = [
    {
      name: '뽀삐',
      breedId: '시바견',
      age: 3,
      birthday: '2018-01-01',
      size: '소형견',
      gender: '수컷',
      isNeuter: true,
      introduction: '안녕하세요',
      character: ['사람을 좋아함', '낯선 사람을 좋아함', '낯선 사람을 좋아함'],
    },
    {
      name: '쿠키',
      breedId: '말티즈',
      age: 3,
      birthday: '2018-01-01',
      size: '소형견',
      gender: '암컷',
      isNeuter: false,
      introduction: '안녕하세요',
      character: ['사람을 좋아함', '낯선 사람을 좋아함', '낯선 사람을 좋아함'],
    },
  ];

  return (
    <div className="pb-16">
      <div className="w-full p-4 grid grid-cols-3">
        <div></div>
        <h1 className="text-center text-lg font-bold">마이페이지</h1>
        <div className="w-full flex justify-end items-center space-x-4">
          <IoNotificationsOutline className="text-2xl text-zinc-700" />
          <SlSettings className="text-[1.35rem] text-zinc-700" />
        </div>
      </div>
      <hr />

      <div className="p-4 flex flex-col space-y-8">
        <div className="flex flex-col space-y-5">
          <div className="flex justify-between items-center">
            <p className="font-bold text-lg">뽀삐 주인</p>
            {/* <div className="px-2 py-1 bg-deep-coral rounded-2xl flex items-center space-x-1">
              <HiPencil className="text-white" />
              <p className="text-white">수정</p>
            </div> */}
            <PiNotePencil className="text-2xl" />
          </div>

          <div className="grid grid-cols-3">
            {userInfo.map((info, idx) => (
              <div key={idx} className="flex justify-around items-center">
                <p className="text-sm font-semibold">{info}</p>
                <p className="">정보</p>
              </div>
            ))}
          </div>

          <hr />

          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-zinc-500">나의 친구</p>
              <p className="font-semibold">5</p>
            </div>
            <div>
              <button className="p-2 px-3 bg-deep-coral rounded-3xl">
                <p className="text-white text-sm">친구추천</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-cream-bg space-y-4">
        <div className="flex justify-between">
          <p className="font-semibold">반려견 정보</p>
          <div className="flex items-center space-x-1">
            <p className="font-medium text-sm text-[#f7824c]">반려견 등록</p>
            <IoAddCircle className="text-xl text-deep-coral" />
          </div>
        </div>

        <div className="space-y-3">
          <Swiper
            pagination={{
              dynamicBullets: true,
            }}
            modules={[Pagination]}
            className="dogSwiper rounded-lg"
          >
            {dogInfo.map((dog, idx) => (
              <SwiperSlide key={idx}>
                <MyDogInfoCard dog={dog} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <div className="bg-zinc-100 w-full h-3"></div>

      <div className="p-4 flex flex-col space-y-5">
        <div className="flex items-center justify-between">
          <p className="font-semibold">산책 기록</p>
          <div className="flex items-center space-x-1 text-zinc-700">
            {/* <p>더보기</p> */}
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
    </div>
  );
};

export default MyPage;
