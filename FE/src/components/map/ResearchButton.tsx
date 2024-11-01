import { IoMdRefresh } from 'react-icons/io';

interface ResearchButtonProps {
  onClick: () => void;
}

export const ResearchButton = ({ onClick }: ResearchButtonProps) => (
  <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-30">
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:bg-gray-100"
    >
      <IoMdRefresh className="text-xl text-gray-600" />
      <span className="text-gray-600">이 지역 재검색</span>
    </button>
  </div>
);
