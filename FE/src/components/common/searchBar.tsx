import React, { useState } from 'react';
import { IoMdSearch } from 'react-icons/io';

interface SearchBarProps<T extends string | { [key: string]: any }> {
  placeholder?: string;
  data: T[]; // 원본 데이터
  setData: React.Dispatch<React.SetStateAction<T[]>>; // 필터링된 데이터 설정
  filterField?: T extends object ? keyof T : never; // 객체 배열일 때 필터링할 필드
}

const SearchBar = <T extends string | { [key: string]: any }>({
  placeholder,
  data,
  setData,
  filterField,
}: SearchBarProps<T>) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    let filteredResults: T[];
    if (typeof data[0] === 'string') {
      // `string[]`인 경우
      filteredResults = (data as string[]).filter((item) => item.toLowerCase().includes(term.toLowerCase())) as T[];
    } else if (filterField) {
      // 객체 배열인 경우 `filterField`를 사용해 필터링
      filteredResults = (data as T[]).filter((item) =>
        String(item[filterField as keyof T])
          .toLowerCase()
          .includes(term.toLowerCase()),
      );
    } else {
      filteredResults = data;
    }

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
      <IoMdSearch className="text-2xl text-zinc-500 cursor-pointer" onClick={() => handleSearch} />
    </div>
  );
};

export default SearchBar;
