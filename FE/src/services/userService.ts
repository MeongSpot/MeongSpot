import axiosInstance from '@/services/axiosInstance';
import { UserSearchResponse, UserProfileInfo } from '@/types/user';


export const userService = {
  // 사용자 검색
  searchUser: async (nickname: string): Promise<UserSearchResponse> => {
    try {
      const response = await axiosInstance.get(`/api/members/search?nickname=${nickname}`);
      return response.data;
    } catch (error) {
      console.error('Failed to search user:', error);
      throw error;
    }
  },
};
