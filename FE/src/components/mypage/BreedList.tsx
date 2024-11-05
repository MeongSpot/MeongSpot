import { useState } from 'react';
import { DogInfo } from '@/types/dogInfo';
import { useNavigate } from 'react-router-dom';

interface BreedListProps {
  data: string[];
  setData: (info: Partial<DogInfo>) => void;
}

const BreedList = ({ data, setData }: BreedListProps) => {
  const navigate = useNavigate();
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [customBreed, setCustomBreed] = useState('');

  const handleClick = (breed: string) => {
    if (breed === '직접 입력') {
      setIsCustomInput(true);
    } else {
      setData({ breedId: breed });
      navigate('/registerdog');
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomBreed(e.target.value);
  };

  const handleCustomInputSubmit = () => {
    if (customBreed.trim()) {
      setData({ breedId: customBreed });
      navigate('/registerdog');
    }
  };

  return (
    <div>
      {data.map((breed, index) => (
        <div key={index} className="py-4 px-1 mx-2 border-b border-zinc-300">
          {breed === '직접 입력' && isCustomInput ? (
            <div className="grid grid-cols-[80%_20%]">
              <input
                type="text"
                value={customBreed}
                onChange={handleCustomInputChange}
                placeholder="견종을 입력하세요"
                className="rounded-md outline-none"
                autoFocus
              />
              <button
                onClick={handleCustomInputSubmit}
                className="bg-deep-coral py-1 px-2 rounded-md text-white font-semibold cursor-pointer"
              >
                확인
              </button>
            </div>
          ) : (
            <p onClick={() => handleClick(breed)} className="font-semibold text-zinc-600 cursor-pointer">
              {breed}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default BreedList;
