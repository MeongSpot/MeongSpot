import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { DogList } from '@/types/dogInfo';
import { IoMdFemale, IoMdMale } from 'react-icons/io';
import { useDog } from '@/hooks/dog/useDog';
import '../../css/DogDetail.css';
import LoadingOverlay from '@/components/common/LoadingOverlay';

const DogDetail = () => {
  const navigate = useNavigate();
  const { getDogDetail, dogDetail, isLoading } = useDog();
  const { id } = useParams();

  const [isPageSlideIn, setIsPageSlideIn] = useState(false);
  const [startY, setStartY] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0); // 현재 드래그 거리
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    getDogDetail(Number(id));
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setIsPageSlideIn(true);
      }, 50); // 50ms 딜레이

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const formatBirthDate = (birth: string) => {
    const [year, month, day] = birth.split('-');
    return `${parseInt(month)}월 ${parseInt(day)}일`;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || startY === null) return;
    const currentY = e.touches[0].clientY;
    const diffY = currentY - startY;

    if (diffY > 0) {
      setTranslateY(diffY); // 드래그 거리만큼 이동
    }
  };

  const handleTouchEnd = () => {
    if (translateY > 150) {
      navigate(-1); // 일정 거리 이상 드래그 시 페이지 나가기
    } else {
      setTranslateY(0); // 기준 이하일 경우 원래 위치로 돌아감
    }
    setIsDragging(false);
    setStartY(null);
  };

  if (!dogDetail) return null;

  return (
    <div className={`relative page-container ${isPageSlideIn ? 'slide-up' : 'slide-hidden'}`}>
      <img className="w-full h-96 object-cover" src={dogDetail.profileImage} alt="강아지 프로필" />
      <div
        className="absolute top-0 flex items-center justify-start px-4 py-5 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <IoChevronBack size={24} />
      </div>

      <div
        className="flex-1 relative bg-white rounded-t-3xl mt-[-20px] pb-4 pt-6 flex flex-col"
        style={{
          boxShadow: '0 -4px 10px rgba(0, 0, 0, 0.1)',
          maxHeight: '60vh',
          transform: `translateY(${translateY}px)`, // 드래그 거리 적용
          transition: isDragging ? 'none' : 'transform 0.3s ease', // 드래그 중에는 transition 제거, 드래그 끝나면 애니메이션으로 돌아가기
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-12 h-1.5 bg-gray-300 rounded-full"></div>

        <div className="px-5 pt-5 pb-14 flex-1 flex flex-col justify-start space-y-5 overflow-y-auto">
          <div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold">{dogDetail.name}</h1>
              <p className="text-sm text-gray-500 ml-2">
                {dogDetail.gender === 'MALE' ? <IoMdMale size={24} /> : <IoMdFemale size={24} />}
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-1">{dogDetail.breed}</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button className="py-5 bg-[#ffeace] rounded-xl">
              <p className="text-lg font-semibold">{dogDetail.age} 살</p>
              <p className="text-sm text-zinc-500">나이</p>
            </button>
            <button className="py-5 bg-[#ffeace] rounded-xl">
              <p className="text-lg font-semibold">{formatBirthDate(dogDetail.birth)}</p>
              <p className="text-sm text-zinc-500">생일</p>
            </button>
            <button className="py-5 bg-[#ffeace] rounded-xl">
              <p className="text-lg font-semibold">{dogDetail.isNeuter ? '했음' : '안했음'}</p>
              <p className="text-sm text-zinc-500">중성화</p>
            </button>
          </div>

          <div className="pt-5 space-y-2">
            <h2 className="font-semibold">성격</h2>
            <div className="flex flex-wrap gap-2">
              {dogDetail.personality.map((personality, idx) => (
                <span key={idx} className="px-2 py-1 bg-zinc-100 rounded-xl text-sm">
                  {personality}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-5 space-y-2">
            <h2 className="font-semibold">소개</h2>
            <p className="text-sm text-gray-500 leading-relaxed">{dogDetail.introduction}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DogDetail;
