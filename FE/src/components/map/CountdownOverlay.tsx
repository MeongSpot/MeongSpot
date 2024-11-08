// components/map/CountdownOverlay.tsx
import React, { useState, useEffect } from 'react';

interface CountdownOverlayProps {
  onComplete: () => void;
}

const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ onComplete }) => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
      {count > 0 && (
        <div className="flex flex-col items-center">
          <span className="text-white text-8xl font-bold">{count}</span>
          <p className="text-white text-xl mt-4">산책을 시작합니다!</p>
        </div>
      )}
    </div>
  );
};

export default CountdownOverlay;
