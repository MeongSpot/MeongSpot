import axiosInstance from '@/services/axiosInstance';
import { UserProfileInfoResponse, UserProfileInfo } from '@/types/user';


export const profileService = {
  // 유저 프로필 정보 조회
  getUserProfile: async (userId: number): Promise<UserProfileInfoResponse> => {
    try {
      const response = await axiosInstance.get(`/api/members/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  },
};
