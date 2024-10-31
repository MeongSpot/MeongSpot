import React from 'react';
import MyDogInfoCard from '@/components/mypage/MyDogInfoCard';
import { IoNotificationsOutline } from 'react-icons/io5';
import { HiPencil } from 'react-icons/hi';
import { IoAddCircle } from 'react-icons/io5';
import { FaAngleRight } from 'react-icons/fa6';
import { Swiper, SwiperSlide } from 'swiper/react';
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
    <div>
      <div className="w-full p-4 grid grid-cols-3">
        <div></div>
        <h1 className="text-center text-lg font-bold">마이페이지</h1>
        <div className="w-full flex justify-end items-center">
          <IoNotificationsOutline className="text-2xl text-gray-600" />
        </div>
      </div>
      <hr />

      <div className="p-4 bg-cream-bg flex flex-col space-y-8">
        <div className="w-full p-4 bg-white rounded-lg flex flex-col space-y-5">
          <div className="flex justify-between items-center">
            <p className="font-semibold">뽀삐 주인</p>
            <div className="px-2 py-1 bg-deep-coral rounded-2xl flex items-center space-x-1">
              <HiPencil className="text-white" />
              <p className="text-white font-medium">수정</p>
            </div>
          </div>

          <div className="grid grid-cols-3">
            {userInfo.map((info, idx) => (
              <div key={idx} className="flex justify-around items-center">
                <p className="text-sm font-semibold">{info}</p>
                <p className="">정보</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
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
      </div>

      <div className="bg-zinc-100 w-full h-3"></div>

      <div className="px-4 pt-4 pb-3">
        <div className="flex justify-between items-center">
          <p className="font-medium">친구 목록</p>
          <FaAngleRight className="text-lg" />
        </div>
      </div>
      <div className="px-4 py-3">
        <div className="flex justify-between items-center">
          <p className="font-medium">산책 기록</p>
          <FaAngleRight className="text-lg" />
        </div>
      </div>
      <div className="px-4 py-3">
        <div className="flex justify-between items-center">
          <p className="font-medium">회원 탈퇴</p>
          <FaAngleRight className="text-lg" />
        </div>
      </div>
    </div>
  );
};

export default MyPage;
