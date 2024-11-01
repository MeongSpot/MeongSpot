import { useState, useEffect } from 'react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onHide: () => void;
}

export const Toast = ({ message, isVisible, onHide }: ToastProps) => {
  const [animation, setAnimation] = useState('');

  useEffect(() => {
    if (isVisible) {
      setAnimation('animate-slideDown');
      const timer = setTimeout(() => {
        setAnimation('animate-slideUp');
        setTimeout(onHide, 100); // 애니메이션 완료 후 숨김 처리
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onHide]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-lg rounded-lg px-6 py-3 ${animation}`}
    >
      <p className="text-center font-medium">{message}</p>
    </div>
  );
};

export default Toast;
