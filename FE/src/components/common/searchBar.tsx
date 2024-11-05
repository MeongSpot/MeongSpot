import React, { useState, useEffect } from 'react';
import { IoMdSearch } from 'react-icons/io';

interface SearchBarProps {
  placeholder?: string;
  data: string[]; // 원본 데이터
  setData: React.Dispatch<React.SetStateAction<string[]>>; // 필터링된 데이터 설정
}

const SearchBar = ({ placeholder, data, setData }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    // 입력할 때마다 실시간으로 data를 필터링
    const filteredResults = data.filter((item) => item.toLowerCase().includes(term.toLowerCase()));
    setData(filteredResults);
  };

  return (
    <div className="p-3 border border-zinc-400 rounded-md flex items-center">
      <input
        className="focus:outline-none w-full"
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleSearch}
      />
      <IoMdSearch className="text-2xl text-zinc-500" />
    </div>
  );
};

export default SearchBar;
