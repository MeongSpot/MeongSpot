import { FaPaw } from 'react-icons/fa';

interface LoadingOverlayProps {
  message?: string; // 메세지 안넣어도 쓸 수 있음
}

const LoadingOverlay = ({ message = '로딩중...' }: LoadingOverlayProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex flex-col items-center">
        <FaPaw className="animate-bounce text-white text-5xl mb-4" />
        <div className="text-white text-lg">{message}</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
