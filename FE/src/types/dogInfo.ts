export interface DogInfo {
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
  }
  gender: string;
  isNeuter: boolean | null;
  introduction: string;
  personality: number[];
};

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
  personality: number[];
};

export interface DogListResponse {
  code: string;
  message: string;
  data: DogList[];
}