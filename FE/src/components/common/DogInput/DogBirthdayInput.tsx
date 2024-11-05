import React, { ChangeEvent } from 'react';
import { DogInfo } from '@/types/dogInfo';

interface DogBirthdayInputProps {
  formData: DogInfo;
  setFormData: (info: Partial<DogInfo>) => void;
}

const DogBirthdayInput: React.FC<DogBirthdayInputProps> = ({ formData, setFormData }) => {
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value.length <= 4) {
      setFormData({
        birth: {
          ...formData.birth,
          year: value,
        },
      });
    }
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      birth: {
        ...formData.birth,
        [name]: value,
      },
    });
  };

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">생년월일</p>
      <div className="flex gap-2">
        <input
          type="text"
          name="year"
          placeholder="년도 4자리"
          value={formData.birth.year || ''}
          onChange={handleYearChange}
          onFocus={handleInputFocus}
          maxLength={4}
          className="w-[40%] py-3 px-4 border-[1.5px] border-gray-300 rounded-lg outline-none"
        />
        <select
          name="month"
          value={formData.birth.month || ''}
          onChange={handleSelectChange}
          onFocus={handleInputFocus}
          className="w-[30%] py-3 px-4 border-[1.5px] border-gray-300 rounded-lg outline-none"
        >
          <option value="">월</option>
          {months.map((month) => (
            <option key={month} value={month.toString().padStart(2, '0')}>
              {month}월
            </option>
          ))}
        </select>
        <select
          name="day"
          value={formData.birth.day || ''}
          onChange={handleSelectChange}
          onFocus={handleInputFocus}
          className="w-[30%] py-3 px-4 border-[1.5px] border-gray-300 rounded-lg outline-none"
        >
          <option value="">일</option>
          {days.map((day) => (
            <option key={day} value={day.toString().padStart(2, '0')}>
              {day}일
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DogBirthdayInput;
