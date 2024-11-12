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
  id?: number;
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