import axiosInstance from '@/services/axiosInstance';
import type {
  TopMeetingsResponse,
  MeetingListResponse,
  OrderType,
  CreateMeetingRequest,
  CreateMeetingResponse,
  MeetingDetailResponse,
  HashtagResponse,
  DogImagesResponse,
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
      if (error instanceof Error) {
        throw new Error(`Failed to fetch meetings: ${error.message}`);
      }
      throw new Error('Failed to fetch meetings');
    }
  },

  createMeeting: async (meetingData: CreateMeetingRequest) => {
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

  fetchMeetingInfo: async (meetingId: string) => {
    try {
      const response = await axiosInstance.get<MeetingDetailResponse>(`/api/meetings/${meetingId}/info`);
      if (response.data.code === 'MT104') {
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch meeting info: ${error.message}`);
      }
      throw new Error('Failed to fetch meeting info');
    }
  },

  fetchHashtags: async (meetingId: string) => {
    try {
      const response = await axiosInstance.get<HashtagResponse>(`/api/meetings/${meetingId}/hashtag`);
      if (response.data.code === 'MT105') {
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch hashtags: ${error.message}`);
      }
      throw new Error('Failed to fetch hashtags');
    }
  },

  fetchDogImages: async (meetingId: string) => {
    try {
      const response = await axiosInstance.get<DogImagesResponse>(
        `/api/dogs/meeting/profileImage?meetingId=${meetingId}`,
      );
      if (response.data.code === 'DO108') {
        return response.data.data;
      }
      throw new Error(response.data.message);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch dog images: ${error.message}`);
      }
      throw new Error('Failed to fetch dog images');
    }
  },
};
