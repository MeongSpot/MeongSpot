import axiosInstance from '@/services/axiosInstance';
import type {
  TopMeetingsResponse,
  MeetingListResponse,
  OrderType,
  CreateMeetingRequest,
  CreateMeetingResponse,
} from '@/types/meetup';

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
      const response = await axiosInstance.get<MeetingListResponse>(`/api/meetings?order=${order}&spotId=${spotId}`);
      if (response.data.code === 'MT102') {
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      throw error;
    }
  },

  createMeeting: async (meetingData: CreateMeetingRequest): Promise<CreateMeetingResponse> => {
    try {
      const response = await axiosInstance.post<CreateMeetingResponse>('/api/meetings', meetingData);
      if (response.data.code === 'MT100') {
        return response.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create meeting: ${error.message}`);
      }
      throw new Error('Failed to create meeting');
    }
  },
};
