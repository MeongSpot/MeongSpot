import axiosInstance from '@/services/axiosInstance';
import { UserMyPageInfoResponse } from '@/types/user';


export const myPageService = {

  // 마이페이지 유저 정보 조회
  getMyPage: async (): Promise<UserMyPageInfoResponse> => {
    try {
      const response = await axiosInstance.get(`/api/members/profile-info`);
      return response.data;
    } catch (error) {
      console.error('Failed to get mypage:', error);
      throw error;
    }
  },

};
