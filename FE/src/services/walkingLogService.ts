import axiosInstance from '@/services/axiosInstance';
import { WalkingLogListResponse, WalkingLogDetailResponse } from '@/types/walkingLog';


export const walkingLogService = {
  // 산책 기록 목록 조회
  getWalkingLogList: async (): Promise<WalkingLogListResponse> => {
    try {
      const response = await axiosInstance.get(`/api/walking-log`);
      return response.data;
    } catch (error) {
      console.error('Failed to get walking logs:', error);
      throw error;
    }
  },

  // 산책 기록 상세 조회
  getWalkingLogDetail: async (walkingLogId: number): Promise<WalkingLogDetailResponse> => {
    try {
      const response = await axiosInstance.get(`/api/walking-log/${walkingLogId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get walking log detail:', error);
      throw error;
    }
  },
}