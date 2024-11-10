import axiosInstance from '@/services/axiosInstance';
import type { TopMeetingsResponse } from '@/types/meetup';

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
};
