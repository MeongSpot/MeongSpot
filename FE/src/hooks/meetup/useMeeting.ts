import { useState, useCallback } from 'react';
import type { Meeting, OrderType,DogImage, CreateMeetingRequest, MeetingDetailInfo, UseMeetingReturn } from '@/types/meetup';
import { meetingService } from '@/services/meetingService';

export const useMeeting = (): UseMeetingReturn => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [spotName, setSpotName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meetingDetail, setMeetingDetail] = useState<MeetingDetailInfo | null>(null);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [dogImages, setDogImages] = useState<DogImage[]>([]);

  const fetchTopMeetings = useCallback(async (spotId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await meetingService.fetchTopMeetings(spotId);
      setMeetings(data.meetings);
      setSpotName(data.spotName);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMeetings = useCallback(async (spotId: number, order: OrderType) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await meetingService.fetchMeetings(spotId, order);
      setMeetings(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createMeeting = useCallback(async (data: CreateMeetingRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await meetingService.createMeeting(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMeetingDetail = useCallback(async (meetingId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const [info, tags, images] = await Promise.all([
        meetingService.fetchMeetingInfo(meetingId),
        meetingService.fetchHashtags(meetingId),
        meetingService.fetchDogImages(meetingId),
      ]);
      setMeetingDetail(info);
      setHashtags(tags);
      setDogImages(images);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    meetings,
    spotName,
    isLoading,
    error,
    meetingDetail,
    hashtags,
    dogImages,
    fetchTopMeetings,
    fetchMeetings,
    createMeeting,
    fetchMeetingDetail,
  };
};
