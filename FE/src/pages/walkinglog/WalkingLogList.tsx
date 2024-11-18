import { useEffect, useState } from 'react';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useWalkingLog } from '@/hooks/walkinglog/useWalkingLog';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import { MonthlyWalkingLogInfo, RecentWalkingLogInfo } from '@/types/walkingLog';
import MascotDog from '@/components/common/Logo/Mascot';

const WalkingLogList = () => {
  const navigate = useNavigate();
  const { isLoading, monthlyWalkingLogs, recentWalkingLogs, getWalkingLogList, selectedDogName, setSelectedDogName } =
    useWalkingLog();
  const [showAllDogs, setShowAllDogs] = useState(false);

  useEffect(() => {
    getWalkingLogList();
  }, []);

  const handleDogSelect = (dogName: string) => {
    setSelectedDogName(dogName);
    setShowAllDogs(false);
  };

  const handleDogClick = () => {
    setShowAllDogs(!showAllDogs);
  };

  if (isLoading) {
    return <LoadingOverlay message="로딩 중..." />;
  }

  const selectedDog = monthlyWalkingLogs.find((log) => log.dogName === selectedDogName) || monthlyWalkingLogs[0];

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="sticky top-0 z-30 bg-white">
        <div className="p-4 grid grid-cols-3 items-center">
          <IoChevronBack onClick={() => navigate('/mypage')} size={24} />
          <p className="text-center text-lg font-bold">산책 기록</p>
        </div>
        <hr />
      </div>

      {monthlyWalkingLogs.length > 0 ? (
        <div className="p-4">
          <div className="grid grid-cols-[30%_70%] items-center space-x-3">
            <p className="font-semibold">이번달 통계</p>

            <div className="relative flex justify-end">
              <div
                className="w-12 h-12 border-2 border-white rounded-full overflow-hidden cursor-pointer shadow-md"
                onClick={handleDogClick}
              >
                <img src={selectedDog?.dogImage} alt={selectedDog?.dogName} className="w-full h-full object-cover" />
              </div>

              {/* 반투명 검정 오버레이 */}
              {showAllDogs && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={() => setShowAllDogs(false)}></div>
              )}

              {/* 모든 강아지 프로필 목록 */}
              <div
                className={`absolute -right-2 top-9 flex flex-col items-end gap-2 p-2 rounded-lg z-20 duration-300 ${
                  showAllDogs ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                }`}
                style={{ transition: 'max-height 0.3s ease, opacity 0.3s ease' }}
              >
                {monthlyWalkingLogs
                  .filter((log) => log.dogName !== selectedDogName)
                  .map((log, index) => (
                    <div
                      key={log.dogImage}
                      className="flex w-full justify-end items-center space-x-2 transform translate-y-4 opacity-0"
                      style={{
                        transition: `opacity 0.3s ease ${index * 0.08}s, transform 0.3s ease ${index * 0.08}s`,
                        opacity: showAllDogs ? 1 : 0,
                        transform: showAllDogs ? 'translate-y-0' : 'translate-y-4',
                      }}
                    >
                      <p className="text-white font-medium">{log.dogName}</p>
                      <div
                        className="w-12 h-12 border rounded-full overflow-hidden cursor-pointer"
                        onClick={() => handleDogSelect(log.dogName)}
                      >
                        <img src={log.dogImage} alt={log.dogName} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* 선택된 강아지 이번달 통계 및 산책 정보 */}
          <div className="flex flex-col justify-center items-center space-y-5 mt-4">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 border rounded-full overflow-hidden">
                <img src={selectedDog?.dogImage} alt={selectedDog?.dogName} className="w-full h-full object-cover" />
              </div>
              <p className="mt-2 font-semibold">{selectedDog?.dogName}</p>
            </div>

            <div className="w-full grid grid-cols-3 items-center">
              <div className="flex flex-col justify-center items-center">
                <p className="text-sm text-zinc-500">산책 횟수</p>
                <p className="text-zinc-800 font-semibold">{selectedDog?.monthlyWalkCount || 0}회</p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <p className="text-sm text-zinc-500">산책 거리</p>
                <p className="text-zinc-800 font-semibold">
                  {selectedDog.monthlyWalkDistance ? (selectedDog?.monthlyWalkDistance / 1000).toFixed(2) : 0}Km
                </p>
              </div>
              <div className="flex flex-col justify-center items-center">
                <p className="text-sm text-zinc-500">산책 시간</p>
                <p className="text-zinc-800 font-semibold">
                  {selectedDog?.monthlyWalkTime
                    ? selectedDog.monthlyWalkTime >= 60
                      ? `${(selectedDog.monthlyWalkTime / 60).toFixed(1)}시간`
                      : `${selectedDog.monthlyWalkTime}분`
                    : '0분'}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-2">
          <p className="font-semibold">이번달 통계</p>
          <div className="h-44 flex justify-center items-center">
            <div className="flex flex-col justify-center items-center h-64 text-gray-500">
              <p className="text-sm">이번달 통계가 없습니다</p>
            </div>
          </div>
        </div>
      )}

      {/* 최근 산책 */}
      <div className="p-4 bg-cream-bg flex-grow">
        <p className="my-2 font-semibold">최근 산책</p>
        {recentWalkingLogs.length > 0 ? (
          <div className="space-y-4">
            {recentWalkingLogs.map((log: RecentWalkingLogInfo) => (
              <div
                key={log.walkingLogId}
                onClick={() => navigate(`/walkinglog/${log.walkingLogId}`)}
                className="bg-white py-4 px-4 rounded-xl flex flex-col justify-center cursor-pointer"
              >
                <p className="mb-2 text-sm text-zinc-800">{new Date(log.date).toLocaleDateString('ko-KR')}</p>
                <div className="space-y-5">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 border rounded-full overflow-hidden">
                      <img src={log.dogImage} alt={log.dogName} className="w-full h-full object-cover" />
                    </div>
                    <p className="mt-2 font-semibold">{log.dogName}</p>
                  </div>

                  <div className="w-full grid grid-cols-2 items-center">
                    <div className="flex flex-col justify-center items-center">
                      <p className="text-sm text-zinc-500">산책 거리</p>
                      <p className="text-zinc-800 font-semibold">
                        {log.distance ? (log?.distance / 1000).toFixed(2) : 0}Km
                      </p>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                      <p className="text-sm text-zinc-500">산책 시간</p>
                      <p className="text-zinc-800 font-semibold">
                        {log.time ? (log.time >= 60 ? `${(log.time / 60).toFixed(1)}시간` : `${log.time}분`) : '0분'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-28 flex justify-center items-center">
            <div className="flex flex-col justify-center items-center text-gray-500">
              <div className="rounded-full bg-gray-200 p-3 mb-2">
                <MascotDog className="w-12 h-12 grayscale" />
              </div>
              <p className="text-sm">최근 산책 기록이 없습니다</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WalkingLogList;
