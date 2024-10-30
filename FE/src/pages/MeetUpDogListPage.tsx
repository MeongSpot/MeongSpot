import DogListHeader from '@/components/meetUp/DogListHeader';
import DogCard from '@/components/meetUp/DogListCard';

const MeetUpDogListPage = () => {
  const dogs = [
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
      <DogListHeader title="저녁 산책 같이해요~" />
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">참여 강아지 {dogs.length}</h2>
        {dogs.map((dog) => (
          <DogCard key={dog.id} dog={dog} />
        ))}
      </div>
    </div>
  );
};

export default MeetUpDogListPage;
