import React from 'react';

interface SortButtonsProps {
  sortBy: string;
  onSortChange: (sortType: string) => void;
}

const RoomSortButton: React.FC<SortButtonsProps> = ({ sortBy, onSortChange }) => (
  <div className="flex space-x-2">
    <button
      onClick={() => onSortChange('latest')}
      className={`px-3 py-1 rounded-full ${sortBy === 'latest' ? 'bg-cream-bg border-deep-coral' : 'bg-white'} border `}
    >
      최신순
    </button>
    <button
      onClick={() => onSortChange('oldest')}
      className={`px-3 py-1 rounded-full ${sortBy === 'oldest' ? 'bg-cream-bg border-deep-coral' : 'bg-white'} border`}
    >
      남은 시간순
    </button>
  </div>
);

export default RoomSortButton;
