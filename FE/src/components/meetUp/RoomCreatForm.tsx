import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import CreateTimeModal from './CreateTimeModal';

const RoomCreatForm = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState<string[]>(['활발한_강아지_환영']);
  const [maxParticipants, setMaxParticipants] = useState('');
  const [selectedDogs, setSelectedDogs] = useState<string[]>([]);
  const availableDogs = ['뽀삐', '코킹', '초코', '바둑이']; // 선택할 수 있는 강아지 목록
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (newTag) {
        setTags([...tags, newTag]);
        e.currentTarget.value = '';
      }
    }
  };

  const handleTagDelete = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleDogAdd = (dog: string) => {
    if (!selectedDogs.includes(dog)) {
      setSelectedDogs([...selectedDogs, dog]);
    }
  };

  const handleDogDelete = (index: number) => {
    setSelectedDogs(selectedDogs.filter((_, i) => i !== index));
  };

  const handleTimeModalOpen = () => {
    setIsTimeModalOpen(true);
  };

  const handleTimeModalClose = () => {
    setIsTimeModalOpen(false);
  };

  return (
    <div className="pb-24">
      <label className="block text-sm font-semibold text-gray-700 mb-1">산책 모임 제목을 입력해주세요</label>
      <input
        type="text"
        placeholder="모임 제목 입력"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-deep-coral"
      />

      <label className="block text-sm font-semibold text-gray-700 mb-1">산책 모임을 진행할 날짜를 입력해주세요</label>
      <div className="relative mb-4">
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="산책 모임 날짜 입력"
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-deep-coral"
          wrapperClassName="w-full"
          locale={ko}
        />
        <FaCalendarAlt className="absolute top-3 right-3 text-gray-400" />
      </div>

      <label className="block text-sm font-semibold text-gray-700 mb-1">산책 모임을 진행할 시간을 입력해주세요</label>
      <div className="relative mb-4" onClick={handleTimeModalOpen}>
        <input
          type="text"
          placeholder="산책 모임 시간 선택"
          value={startTime && endTime ? `${startTime} - ${endTime}` : ''}
          readOnly
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-deep-coral"
        />
        <FaClock className="absolute top-3 right-3 text-gray-400" />
      </div>
      <CreateTimeModal
        isOpen={isTimeModalOpen}
        onClose={handleTimeModalClose}
        startTime={startTime}
        endTime={endTime}
        setStartTime={setStartTime}
        setEndTime={setEndTime}
      />

      <label className="block text-sm font-semibold text-gray-700 mb-1">산책 모임 세부 장소를 알려주세요</label>
      <input
        type="text"
        placeholder="산책 모임 세부 장소 입력"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-deep-coral"
      />

      <label className="block text-sm font-semibold text-gray-700 mb-1">산책 모임을 나타낼 해시태그를 입력해주세요</label>
      <input
        type="text"
        placeholder="태그를 입력해주세요."
        onKeyDown={handleTagAdd}
        className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-deep-coral"
      />
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="text-xs text-deep-coral bg-orange-100 px-2 py-1 rounded-full cursor-pointer"
            onClick={() => handleTagDelete(index)}
          >
            #{tag}
          </span>
        ))}
      </div>

      <label className="block text-sm font-semibold text-gray-700 mb-1">산책 모임 최대 인원을 입력해주세요</label>
      <input
        type="number"
        placeholder="최대 참석 인원 입력"
        value={maxParticipants}
        onChange={(e) => setMaxParticipants(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-deep-coral"
      />

      <label className="block text-sm font-semibold text-gray-700 mb-1">누구와 함께 갈까요?</label>
      <div className="relative mb-4">
        <select
          onChange={(e) => handleDogAdd(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-deep-coral"
          value=""
        >
          <option value="">함께할 강아지 선택하기</option>
          {availableDogs.map((dog) => (
            <option key={dog} value={dog}>
              {dog}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {selectedDogs.map((dog, index) => (
          <span
            key={index}
            className="text-sm text-deep-coral bg-orange-100 px-2 py-1 rounded-full cursor-pointer"
            onClick={() => handleDogDelete(index)}
          >
            {dog}
          </span>
        ))}
      </div>

      <div className="mt-8">
        <button className="w-full bg-deep-coral text-white py-2 rounded-lg font-bold">모임 생성하기</button>
      </div>
    </div>
  );
};

export default RoomCreatForm;
