interface ToggleButtonProps {
  isWalkingMode: boolean;
  onChange: (mode: boolean) => void;
}

export const ToggleButton = ({ isWalkingMode, onChange }: ToggleButtonProps) => {
  return (
    <div
      className={`relative h-10 w-28 rounded-full flex items-center cursor-pointer transition-colors duration-300 ${
        isWalkingMode ? 'bg-deep-coral' : 'bg-light-orange'
      }`}
      onClick={() => onChange(!isWalkingMode)}
    >
      {/* 흰색 하이라이트 배경 */}
      <div
        className={`absolute h-8 w-[3.45rem] bg-white rounded-full transition-transform duration-300 ${
          isWalkingMode ? 'translate-x-[3.3rem]' : 'translate-x-[0.35rem]'
        }`}
      />

      {/* 텍스트 컨테이너 */}
      <div className="relative w-full flex justify-between px-2 ">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChange(false);
          }}
          className={`flex-1 text-sm font-semibold whitespace-nowrap z-10 transition-colors duration-300 ${
            !isWalkingMode ? 'text-light-orange' : 'text-white'
          }`}
        >
          모임
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChange(true);
          }}
          className={`flex-1 text-sm font-semibold whitespace-nowrap z-10 transition-colors duration-300 ${
            isWalkingMode ? 'text-deep-coral' : 'text-white'
          }`}
        >
          산책
        </button>
      </div>
    </div>
  );
};
