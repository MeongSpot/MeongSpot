import { create } from 'zustand';
import axiosInstance from '@/services/axiosInstance';

interface AuthState {
  isAuthenticated: boolean;
  checkLoginIdAvailability: (loginId: string) => Promise<{ isAvailable: boolean; message: string }>;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  
  checkLoginIdAvailability: async (loginId: string) => {
    try {
      const response = await axiosInstance.get(`/api/members/check-id`, {
        params: { loginId },
      });
      
      const { code } = response.data;
      
      switch (code) {
        case 'ME101':
          return { isAvailable: true, message: '사용 가능한 아이디입니다.' };
        case 'ME000':
          return { isAvailable: false, message: '이미 사용 중인 아이디입니다.' };
        default:
          return { isAvailable: false, message: '아이디 확인 중 오류가 발생했습니다.' };
      }
    } catch (error) {
      console.error('Login ID check failed:', error);
      return { isAvailable: false, message: '아이디 확인 중 오류가 발생했습니다.' };
    }
  },
}));

export default useAuthStore;