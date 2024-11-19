import { create } from 'zustand';
import { DogInfo } from '@/types/dogInfo';

// Zustand의 상태와 액션 타입 정의
interface DogInfoState {
  dogRegisterInfo: DogInfo;
  setDogRegisterInfo: (info: Partial<DogInfo>) => void;
}

const useDogInfoStore = create<DogInfoState>((set) => ({
  // 초기 상태 설정
  dogRegisterInfo: {
    profileImage: '',
    profile_file: null,
    name: '',
    breedId: '',
    age: null,
    size: '',
    birth: {
      year: '',
      month: '',
      day: '',
    },
    gender: '',
    isNeuter: null,
    introduction: '',
    personality: [],
  },

  // 상태 업데이트 함수
  setDogRegisterInfo: (info) =>
    set((state) => ({
      dogRegisterInfo: {
        ...state.dogRegisterInfo,
        ...info,
      },
    })),
}));

export default useDogInfoStore;
