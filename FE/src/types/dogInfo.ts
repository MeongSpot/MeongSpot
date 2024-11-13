export interface DogInfo {
  id?: number;
  profileImage: string;
  profile_file?: File | null;
  name: string;
  breedId: string;
  age: number | null;
  size: string;
  birth: {
    year: string;
    month: string;
    day: string;
  };
  gender: string;
  isNeuter: boolean | null;
  introduction: string;
  personality: number[];
}

export interface RegisterDogResponse {
  code: string;
  message: string;
  data: DogInfo[];
}

export interface DogBreedsResponse {
  code: string;
  message: string;
  data: string[];
}

export interface DogList {
  id: number;
  size: string;
  profileImage: string;
  name: string;
  breed: string;
  age: number | null;
  birth: string;
  gender: string;
  isNeuter: boolean | null;
  introduction: string;
  personality: string[];
}

export interface DogListResponse {
  code: string;
  message: string;
  data: DogList[];
}

export interface DogName {
  id: number;
  name: string;
}

export interface DogNameResponse {
  code: string;
  message: string;
  data: DogName[];
}

export interface DogDetailResponse {
  code: string;
  message: string;
  data: DogList;
}

export interface MeetingDogInfo {
  profileImage: string;
  name: string;
  breed: string;
  birth: string;
  age: number;
  personality: string[];
}

export const PersonalityList = [
  { id: 1, name: '낯가려요' },
  { id: 2, name: '새로운 친구 만나는걸 좋아해요' },
  { id: 3, name: '호기심이 많아요' },
  { id: 4, name: '소극적이에요' },
  { id: 5, name: '적극적이에요' },
  { id: 6, name: '조금 활발해요' },
  { id: 7, name: '많이 활발해요' },
  { id: 8, name: '겁이 많아요' },
  { id: 9, name: '겁이 없어요' },
  { id: 10, name: '좋아하는 산책 코스가 있어요' },
];