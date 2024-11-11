import axiosInstance from '@/services/axiosInstance';
import type { TopMeetingsResponse, MeetingListResponse, OrderType } from '@/types/meetup';

export const meetingService = {
  fetchTopMeetings: async (spotId: number) => {
    try {
      const response = await axiosInstance.get<TopMeetingsResponse>(`/api/meetings/top?spotId=${spotId}`);
      if (response.data.code === 'MT103') {
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch top meetings: ${error.message}`);
      }
      throw new Error('Failed to fetch top meetings');
    }
  },

  fetchMeetings: async (spotId: number, order: OrderType) => {
    try {
      console.log('Making API call to:', `/api/meetings?order=${order}&spotId=${spotId}`); // 디버깅
      const response = await axiosInstance.get<MeetingListResponse>(`/api/meetings?order=${order}&spotId=${spotId}`);
      console.log('API Response:', response.data); // 디버깅
      if (response.data.code === 'MT102') {
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      console.error('API Error:', error); // 디버깅
      throw error;
    }
  },
};
