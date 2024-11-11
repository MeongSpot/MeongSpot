// CountdownOverlay.tsx
import React, { useState, useEffect } from 'react';

interface CountdownOverlayProps {
  onComplete: () => void;
}

const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ onComplete }) => {
  const [count, setCount] = useState(3);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (count > 0) {
      timer = setTimeout(() => {
        setCount((prev) => prev - 1);
      }, 1000);
    } else {
      timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          onComplete();
        }, 200);
      }, 500);
    }

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <span className="text-white text-8xl font-bold">{count > 0 ? count : '시작!'}</span>
        <p className="text-white text-xl mt-4">산책을 시작합니다!</p>
      </div>
    </div>
  );
};

export default CountdownOverlay;
