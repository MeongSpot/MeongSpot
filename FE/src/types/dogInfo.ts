export interface DogInfo {
  profile_image: string;
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