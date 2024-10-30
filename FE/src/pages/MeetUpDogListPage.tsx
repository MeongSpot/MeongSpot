import React from 'react';
import { FaArrowLeft, FaDog } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface Dog {
  id: number;
  name: string;
  breed: string;
  birthdate: string;
  age: number;
  personalityTags: string[];
}

const MeetUpDogListPage = () => {
  const navigate = useNavigate();

  const dogs: Dog[] = [
    {
      id: 1,
      name: '뽀삐',
      breed: '말티즈',
      birthdate: '',
      age: 0,
      personalityTags: [],
    },
    {
      id: 2,
      name: '두부',
      breed: '치와와',
      birthdate: '',
      age: 0,
      personalityTags: [],
    },
    {
      id: 3,
      name: '감자',
      breed: '코카스파니엘',
      birthdate: '2019-10-11',
      age: 7,
      personalityTags: ['새로운 친구 만나는 걸 좋아해요', '조금 활발해요', '호기심이 많아요'],
    },
    {
      id: 4,
      name: '카토시',
      breed: '스피츠',
      birthdate: '',
      age: 0,
      personalityTags: [],
    },
    {
      id: 5,
      name: '꺼양',
      breed: '포메라니안',
      birthdate: '',
      age: 0,
      personalityTags: [],
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      {/* 헤더 */}
      <div className="flex items-center bg-orange-500 text-white px-4 py-3">
        <button onClick={() => navigate(-1)} className="mr-3">
          <FaArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">저녁 산책 같이해요~</h1>
      </div>

      {/* 참여 강아지 목록 */}
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">참여 강아지 {dogs.length}</h2>
        {dogs.map((dog) => (
          <div key={dog.id} className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex items-center mb-2">
              <FaDog className="text-gray-400 mr-2" size={24} />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">{dog.name}</h3>
                  <p className="text-gray-500">{dog.breed}</p>
                </div>
                {dog.birthdate && (
                  <div className="text-sm text-gray-500 mt-1">
                    <span role="img" aria-label="cake">🎂</span> {dog.birthdate} / {dog.age}살
                  </div>
                )}
              </div>
            </div>

            {/* 성격 태그 */}
            <div className="flex flex-wrap mt-2">
              {dog.personalityTags.map((tag, index) => (
                <span key={index} className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full mr-2 mb-2">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetUpDogListPage;
