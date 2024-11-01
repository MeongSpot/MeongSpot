import { MdSearch } from 'react-icons/md';
import { IoLocationOutline } from 'react-icons/io5';

interface SearchBarProps {
  isWalkingMode: boolean;
  searchKeyword: string;
  currentLocation: string;
  onSearchChange: (value: string) => void;
}

export const SearchBar = ({ isWalkingMode, searchKeyword, currentLocation, onSearchChange }: SearchBarProps) => {
  // 주소 표시 최적화
  const formatAddress = (address: string) => {
    if (!address) return '';
    const parts = address.split(' ');
    const significantParts = parts.slice(1, parts.findIndex((part) => part.includes('동')) + 1);
    return significantParts.join(' ');
  };

  return (
    <div className="flex items-center flex-1 px-3 py-3">
      {isWalkingMode ? (
        <>
          <IoLocationOutline className="text-2xl font-medium text-deep-coral mr-2" />
          <span className="mr-2">현재 위치:</span>
          <span className="text-gray-600">{formatAddress(currentLocation) || '위치를 가져오는 중...'}</span>
        </>
      ) : (
        <>
          <MdSearch className="text-2xl font-medium text-light-orange mr-2" />
          <input
            type="text"
            placeholder="장소를 입력해주세요"
            className="w-full outline-none font-medium"
            value={searchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </>
      )}
    </div>
  );
};
