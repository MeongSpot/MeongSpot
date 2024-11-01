import MascotDog from '@/components/common/Logo/Mascot';

const AlarmPage = () => {
  const hasData = false;

  return (
    <div className="p-4">
      <h1 className="text-center text-lg font-bold mb-4">알림</h1>
      <hr className="my-4 -mx-4 w-screen" />
      <div className="min-h-screen flex flex-col items-center justify-center mt-[-10vh]">
        {hasData ? (
          <div className="flex justify-between items-center mb-4">{/* 알림 내용 */}</div>
        ) : (
          <div className="flex flex-col justify-center items-center h-64 text-gray-500">
            <div className="rounded-full bg-gray-200 p-4 mb-2">
              <MascotDog className="w-16 h-16 grayscale" />
            </div>
            <p className="text-sm">알림 내역이 없습니다</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlarmPage;
