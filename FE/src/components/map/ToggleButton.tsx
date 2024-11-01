interface ToggleButtonProps {
  isWalkingMode: boolean;
  onChange: (mode: boolean) => void;
}

export const ToggleButton = ({ isWalkingMode, onChange }: ToggleButtonProps) => {
  return (
    <div
      className={`relative h-10 w-32 rounded-full flex items-center cursor-pointer transition-colors duration-300 ${
        isWalkingMode ? 'bg-deep-coral' : 'bg-light-orange'
      }`}
      onClick={() => onChange(!isWalkingMode)}
    >
      {/* 흰색 토글 버튼 */}
      <div
        className={`absolute h-8 w-8 bg-white rounded-full transition-transform duration-300 ${
          isWalkingMode ? 'translate-x-[5.7rem]' : 'translate-x-[0.35rem]'
        }`}
      />

      {/* 텍스트 */}
      <div
        className={`absolute w-full transition-transform duration-300 ${isWalkingMode ? 'pl-6 pr-10' : 'pl-10 pr-6'}`}
      >
        <span className={`text-white font-semibold whitespace-nowrap ${isWalkingMode ? '' : 'float-right'}`}>
          {isWalkingMode ? '모임 찾기' : '산책하기'}
        </span>
      </div>
    </div>
  );
};
