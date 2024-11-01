import { MdSearch } from 'react-icons/md';
import { IoLocationOutline } from 'react-icons/io5';
import { useRef, useEffect, useState } from 'react';
import { debounce } from 'lodash';

interface SearchBarProps {
  isWalkingMode: boolean;
  searchKeyword: string;
  currentLocation: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

export const SearchBar = ({
  isWalkingMode,
  searchKeyword,
  currentLocation,
  onSearchChange,
  onSearch,
}: SearchBarProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const formatAddress = (address: string) => {
    if (!address) return '';
    const parts = address.split(' ');
    const dongIndex = parts.findIndex((part) => part.includes('동'));
    return dongIndex !== -1 ? parts.slice(1, dongIndex + 1).join(' ') : address;
  };

  useEffect(() => {
    const checkTextWidth = () => {
      if (textRef.current && containerRef.current) {
        const textWidth = textRef.current.scrollWidth;
        const containerWidth = containerRef.current.clientWidth;
        setShouldAnimate(textWidth > containerWidth);
      }
    };

    checkTextWidth();
    window.addEventListener('resize', checkTextWidth);
    return () => window.removeEventListener('resize', checkTextWidth);
  }, [currentLocation]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (selectedIndex >= 0) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else {
        onSearch();
        setShowSuggestions(false);
      }
      setSelectedIndex(-1); // 검색 입력한 흔적 리셋
    }
  };

  const getSuggestions = debounce((keyword: string) => {
    if (!keyword.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const places = data.map((place) => place.place_name);
        setSuggestions(places.slice(0, 3));
        setShowSuggestions(true);
        setSelectedIndex(-1); // Reset selected index when new suggestions appear
      }
    });
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
    getSuggestions(e.target.value);
    setSelectedIndex(-1); // 들어가 있는 내용 리셋
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSearchChange(suggestion);
    setShowSuggestions(false);
    setSelectedIndex(-1); // 선택한거 리셋
    onSearch();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        onSearch();
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          onSearch();
        }
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    setSelectedIndex(-1);
    if (!searchKeyword.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchKeyword]);

  return (
    <div className="flex items-center flex-1 px-3 py-3 min-w-0 z-100">
      {isWalkingMode ? (
        <>
          <IoLocationOutline className="text-2xl font-medium text-deep-coral mr-2 flex-shrink-0" />
          <span className="mr-2 flex-shrink-0 whitespace-nowrap">현재 위치:</span>
          <div ref={containerRef} className="overflow-hidden flex-1 min-w-0">
            <div ref={textRef} className={`whitespace-nowrap text-gray-600 ${shouldAnimate ? 'animate-marquee' : ''}`}>
              {formatAddress(currentLocation) || '위치를 가져오는 중...'}
            </div>
          </div>
        </>
      ) : (
        <>
          <button
            onClick={() => {
              onSearch();
              setShowSuggestions(false);
            }}
            className="ml-2 text-light-orange hover:text-orange-600"
          >
            <MdSearch className="text-2xl" />
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="장소를 입력해주세요"
              className="w-full outline-none font-medium"
              value={searchKeyword}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-100">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 cursor-pointer ${
                      index === selectedIndex ? 'bg-gray-100' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
