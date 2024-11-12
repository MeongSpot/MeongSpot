import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import { AiOutlineDown } from 'react-icons/ai';
import CreateTimeModal from './CreateTimeModal';
import { useNavigate, useParams } from 'react-router-dom';
import { useDog } from '@/hooks/dog/useDog';
import { useMeeting } from '@/hooks/meetup/useMeeting';
import { Toast } from '@/components/common/Message/Toast';
import FormErrorMessage from '@/components/common/Message/FormErrorMessage';
import FormField from './FormField';

const RoomCreatForm = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [maxParticipants, setMaxParticipants] = useState(2);
  const [selectedDogs, setSelectedDogs] = useState<number[]>([]);
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  // 에러 상태
  const [errors, setErrors] = useState<{
    title?: string;
    date?: string;
    startTime?: string;
    location?: string;
    description?: string;
    dogs?: string;
  }>({});

  const navigate = useNavigate();
  const { id: placeId } = useParams();
  const { myDogsName, getMyDogsName } = useDog();
  const { createMeeting, isLoading } = useMeeting();

  const minDate = new Date();
  const maxDate = new Date(minDate.getTime() + 14 * 24 * 60 * 60 * 1000);

  useEffect(() => {
    // 이미 강아지 있다면 호출 안함
    if (myDogsName.length === 0) {
      getMyDogsName();
    }
  }, [myDogsName.length]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 30) {
      setTitle(value);
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 250) {
      setDescription(value);
      setErrors((prev) => ({ ...prev, description: undefined }));
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 30) {
      setLocation(value);
      setErrors((prev) => ({ ...prev, location: undefined }));
    }
  };

  const MAX_TAGS = 5;
  const MAX_TAG_LENGTH = 15;

  const handleTagAdd = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // 태그 갯수 먼저 체크
      if (tags.length >= MAX_TAGS) {
        return;
      }

      const newTag = e.currentTarget.value.trim().replace(/\s/g, '_');

      // 그 다음 길이와 유효성 체크
      if (newTag.length > MAX_TAG_LENGTH) {
        return;
      }

      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        e.currentTarget.value = '';
      }
    }
  };

  const handleTagDelete = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleDogSelect = (dogId: number) => {
    if (selectedDogs.includes(dogId)) {
      setSelectedDogs(selectedDogs.filter((id) => id !== dogId));
    } else {
      setSelectedDogs([...selectedDogs, dogId]);
    }
    setErrors((prev) => ({ ...prev, dogs: undefined }));
  };

  const handleTimeModalOpen = () => {
    setIsTimeModalOpen(true);
  };

  const handleTimeModalClose = () => {
    setIsTimeModalOpen(false);
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMaxParticipants(Number(e.target.value));
  };

  const validateForm = () => {
    const newErrors = {
      title: !title.trim() ? '모임 제목을 입력해주세요' : undefined,
      date: !date ? '모임 날짜를 선택해주세요' : undefined,
      startTime: !startTime ? '모임 시간을 선택해주세요' : undefined,
      dogs: selectedDogs.length === 0 ? '참여할 강아지를 선택해주세요' : undefined,
    };

    setErrors(newErrors);

    const firstError = Object.entries(newErrors).find(([, error]) => error !== undefined);
    if (firstError) {
      const [fieldName] = firstError;
      const element = document.querySelector(`[name="${fieldName}"]`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      showToast(firstError[1] || '필수 정보를 입력해주세요');
      return false;
    }

    return true;
  };

  const createClick = async () => {
    if (!validateForm() || !placeId || !date) return;

    if (isLoading) return;

    try {
      const [hour, minute] = startTime.split(':').map(Number);
      const formattedDate = date.toISOString().split('T')[0];

      // 기본 필수 데이터
      const meetingData: any = {
        spotId: Number(placeId),
        title,
        date: formattedDate,
        hour,
        minute,
        maxParticipants,
        dogs: selectedDogs,
      };

      // 선택적 데이터 추가
      if (location.trim()) {
        meetingData.detailLocation = location;
      }
      if (description.trim()) {
        meetingData.information = description;
      }
      if (tags.length > 0) {
        meetingData.hashtag = tags;
      }

      await createMeeting(meetingData);

      showToast('모임이 성공적으로 생성되었습니다');
      navigate(`/allmeetuproom/${placeId}`);
    } catch (error) {
      showToast('모임 생성에 실패했습니다');
    }
  };

  return (
    <div>
      <Toast message={toastMessage} isVisible={isToastVisible} onHide={() => setIsToastVisible(false)} />

      <FormField label="산책 모임 제목" required currentLength={title.length} maxLength={30}>
        <input
          name="title"
          type="text"
          placeholder="모임 제목을 입력해주세요"
          value={title}
          onChange={handleTitleChange}
          className={`w-full p-3 border rounded-lg focus:outline-none transition-colors ${
            errors.title ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-deep-coral'
          }`}
        />
        {errors.title && <FormErrorMessage message={errors.title} />}
      </FormField>

      <FormField label="산책 모임 날짜" required>
        <div className="relative">
          <DatePicker
            name="date"
            selected={date}
            onChange={(date) => {
              setDate(date);
              setErrors((prev) => ({ ...prev, date: undefined }));
            }}
            dateFormat="yyyy-MM-dd"
            placeholderText="산책 모임 날짜를 선택해주세요"
            className={`w-full p-3 border rounded-lg focus:outline-none ${
              errors.date ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-deep-coral'
            }`}
            wrapperClassName="w-full"
            locale={ko}
            minDate={minDate}
            maxDate={maxDate}
          />
          <FaCalendarAlt className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
        </div>
        {errors.date && <FormErrorMessage message={errors.date} />}
      </FormField>

      <FormField label="산책 모임 시간" required>
        <div
          className={`relative border rounded-lg cursor-pointer ${
            errors.startTime ? 'border-red-500' : 'border-gray-200'
          }`}
          onClick={handleTimeModalOpen}
        >
          <input
            name="startTime"
            type="text"
            placeholder="산책 모임 시간을 선택해주세요"
            value={startTime ? `${startTime}` : ''}
            readOnly
            className="w-full p-3 rounded-lg cursor-pointer"
          />
          <FaClock className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
        </div>
        {errors.startTime && <FormErrorMessage message={errors.startTime} />}
      </FormField>
      <CreateTimeModal
        isOpen={isTimeModalOpen}
        onClose={handleTimeModalClose}
        startTime={startTime}
        setStartTime={(time) => {
          setStartTime(time);
          setErrors((prev) => ({ ...prev, startTime: undefined }));
        }}
      />
      <FormField
        label="산책 모임 세부 장소"
        currentLength={location.length}
        maxLength={30}
        optionalText="세부 장소를 입력하면 더 자세한 장소를 공유할 수 있어요"
      >
        <input
          name="location"
          type="text"
          placeholder="산책 모임 세부 장소 입력"
          value={location}
          onChange={handleLocationChange}
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-deep-coral"
        />
      </FormField>

      <FormField
        label="산책 모임 설명"
        currentLength={description.length}
        maxLength={250}
        optionalText="모임에 대해 더 자세히 설명해주세요"
      >
        <textarea
          name="description"
          value={description}
          onChange={handleDescriptionChange}
          placeholder="모임에 대해 설명해주세요"
          className={`w-full p-3 border rounded-lg focus:outline-none resize-none h-24 ${
            errors.description ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-deep-coral'
          }`}
        />
        {errors.description && <FormErrorMessage message={errors.description} />}
      </FormField>

      <FormField
        label="해시태그"
        optionalText="띄어쓰기는 _로 표시됩니다"
        currentLength={tags.length}
        maxLength={MAX_TAGS}
      >
        <input
          type="text"
          placeholder={
            tags.length >= MAX_TAGS ? '태그는 최대 5개까지 입력 가능합니다' : '태그 입력 후 엔터 (최대 15자)'
          }
          onKeyDown={handleTagAdd}
          maxLength={MAX_TAG_LENGTH}
          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:border-deep-coral"
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="bg-deep-coral text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              #{tag}
              <button onClick={() => handleTagDelete(index)} className="hover:text-gray-200">
                ×
              </button>
            </span>
          ))}
        </div>
      </FormField>

      <FormField label="모임 최대 인원" required optionalText="2~10명까지 선택 가능합니다">
        <div className="relative">
          <select
            value={maxParticipants}
            onChange={handleSelectChange}
            className="w-full p-3 pr-10 border border-gray-200 rounded-lg appearance-none focus:outline-none focus:border-deep-coral"
          >
            {[...Array(9)].map((_, i) => (
              <option key={i + 2} value={i + 2}>
                {i + 2}명
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <AiOutlineDown className="text-gray-400" />
          </div>
        </div>
      </FormField>

      <FormField label="함께할 강아지" required>
        <div className="space-y-2">
          <div className="relative">
            <select
              name="dogs"
              onChange={(e) => handleDogSelect(Number(e.target.value))}
              className={`w-full p-3 pr-10 border rounded-lg appearance-none focus:outline-none ${
                errors.dogs ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-deep-coral'
              }`}
              value=""
            >
              <option value="">강아지를 선택해주세요</option>
              {myDogsName.map((dog) => (
                <option key={dog.id} value={dog.id}>
                  {dog.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <AiOutlineDown className="text-gray-400" />
            </div>
          </div>
          {errors.dogs && <FormErrorMessage message={errors.dogs} />}
          <div className="flex flex-wrap gap-2">
            {selectedDogs.map((dogId) => {
              const dog = myDogsName.find((d) => d.id === dogId);
              if (!dog) return null;
              return (
                <span
                  key={dogId}
                  className="bg-deep-coral text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {dog.name}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDogSelect(dogId);
                    }}
                    className="hover:text-gray-200"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      </FormField>
      <div className="sticky bottom-20">
        <button
          onClick={createClick}
          disabled={isLoading}
          className="w-full py-4 rounded-lg text-white font-bold text-lg bg-deep-coral disabled:bg-gray-300 transition-colors"
        >
          {isLoading ? '생성 중...' : '모임 생성하기'}
        </button>
      </div>
    </div>
  );
};

export default RoomCreatForm;
