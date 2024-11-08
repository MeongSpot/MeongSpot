import axiosInstance from '@/services/axiosInstance';
import { GetFriendsResponse } from '@/types/friend';


export const friendService = {
  // 친구 목록 조회
  getFriends: async (): Promise<GetFriendsResponse> => {
    try {
      const response = await axiosInstance.get(`/api/friends`);
      return response.data;
    } catch (error) {
      console.error('Failed to get friends:', error);
      throw error;
    }
  },

};