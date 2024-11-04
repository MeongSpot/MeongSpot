export interface DogInfo {
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