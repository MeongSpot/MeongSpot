import { SearchBar } from './SearchBar';
import { ToggleButton } from './ToggleButton';

interface TopBarProps {
  isWalkingMode: boolean;
  searchKeyword: string;
  currentLocation: string;
  onSearchChange: (value: string) => void;
  onModeChange: (mode: boolean) => void;
}

export const TopBar = ({
  isWalkingMode,
  searchKeyword,
  currentLocation,
  onSearchChange,
  onModeChange,
}: TopBarProps) => {
  return (
    <div className="absolute top-4 left-4 right-4 z-50">
      <div
        className={`bg-white rounded-full shadow-md flex items-center justify-between transition-colors duration-300 ${
          isWalkingMode ? 'border-2 border-deep-coral' : 'border-2 border-light-orange'
        }`}
      >
        <SearchBar
          isWalkingMode={isWalkingMode}
          searchKeyword={searchKeyword}
          currentLocation={currentLocation}
          onSearchChange={onSearchChange}
        />
        <div className="px-2">
          <ToggleButton isWalkingMode={isWalkingMode} onChange={onModeChange} />
        </div>
      </div>
    </div>
  );
};
