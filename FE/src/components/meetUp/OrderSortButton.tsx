import React from 'react';
import { IoCaretUp, IoCaretDown } from 'react-icons/io5';

interface OrderSortButtonProps {
  direction: 'asc' | 'desc';
  onDirectionChange: (direction: 'asc' | 'desc') => void;
}

const OrderSortButton: React.FC<OrderSortButtonProps> = ({ direction, onDirectionChange }) => {
  const handleDirectionClick = () => {
    onDirectionChange(direction === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div onClick={handleDirectionClick} className="relative inline-flex items-center font-semibold">
      <button className="px-3 py-1 pr-8 rounded-full bg-cream-bg border-deep-coral text-deep-coral border-2">
        남은 시간순
      </button>
      <button className="absolute right-3 flex flex-col -space-y-1 text-deep-coral">
        <IoCaretUp size={14} className={direction === 'asc' ? 'text-deep-coral' : 'text-gray-400'} />
        <IoCaretDown size={14} className={direction === 'desc' ? 'text-deep-coral' : 'text-gray-400'} />
      </button>
    </div>
  );
};

export default OrderSortButton;
