import React from 'react';

interface DogPersonalityInputProps {
  value: number[];
  onChange: (id: number) => void;
}

const DogPersonalityInput: React.FC<DogPersonalityInputProps> = ({ value, onChange }) => {
  const PersonalityList = [
    { id: 1, name: '낯가려요' },
    { id: 2, name: '새로운 친구 만나는 걸 좋아해요' },
    { id: 3, name: '호기심이 많아요' },
    { id: 4, name: '많이 활발해요' },
    { id: 5, name: '조금 활발해요' },
    { id: 6, name: '소극적이에요' },
    { id: 7, name: '겁이 많아요' },
    { id: 8, name: '겁이 없어요' },
    { id: 9, name: '좋아하는 산책 코스가 있어요' },
  ];

  const handleButtonClick = (id: number) => {
    onChange(id);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {PersonalityList.map((personality) => (
        <button
          key={personality.id}
          onClick={() => handleButtonClick(personality.id)}
          className={`px-3 py-1 rounded-full border-2 transition-all duration-300 ease-in-out transform 
            ${
              value.includes(personality.id)
                ? 'bg-deep-coral text-white border-deep-coral'
                : 'bg-white text-deep-coral border-deep-coral'
            }`}
        >
          <p className="font-bold">{personality.name}</p>
        </button>
      ))}
    </div>
  );
};

export default DogPersonalityInput;
