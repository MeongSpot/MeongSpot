import axiosInstance from '@/services/axiosInstance';
import { UserMyPageInfoResponse, UserProfileImageUpdateRequest } from '@/types/user';


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

  // 마이페이지 유저 프로필 이미지 수정
  updateProfileImage: async (formData: FormData): Promise<UserProfileImageUpdateRequest> => {
    try {
      const response = await axiosInstance.patch(`/api/members/profile-image`, formData);
      return response.data;
    } catch (error) {
      console.error('Failed to update profile image:', error);
      throw error;
    }
  },
};
