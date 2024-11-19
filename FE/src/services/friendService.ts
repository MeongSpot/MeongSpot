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

  // 친구 삭제
  deleteFriend: async (friendId: number) => {
    try {
      const response = await axiosInstance.delete(`/api/friends/${friendId}`);
      if (response.data.code === 'FR103') {
        return response.data.data;
      }
      if (response.data.code === 'ME003') {
        throw new Error('친구 끊기 실패');
      }
    } catch (error) {
      console.error('Failed to delete friend:', error);
      throw error;
    }
  },

  // 친구 요청 신청
  requestFriend: async (receiverId: number) => {
    try {
      const response = await axiosInstance.post(`/api/friends/invitation`, {
        receiverId
      });
      if (response.data.code === 'FR101') {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },
};