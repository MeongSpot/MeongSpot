// hooks/meeting/useMeeting.ts
import { useState, useCallback } from 'react';
import type { Meeting, OrderType, CreateMeetingRequest } from '@/types/meetup';
import { meetingService } from '@/services/meetingService';

// 리턴 타입을 확장하여 새로운 createMeeting 함수를 포함
interface UseMeetingReturn {
  meetings: Meeting[];
  spotName: string;
  isLoading: boolean;
  error: string | null;
  fetchTopMeetings: (spotId: number) => Promise<void>;
  fetchMeetings: (spotId: number, order: OrderType) => Promise<void>;
  createMeeting: (data: CreateMeetingRequest) => Promise<void>;
}

export const useMeeting = (): UseMeetingReturn => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [spotName, setSpotName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  return {
    meetings,
    spotName,
    isLoading,
    error,
    fetchTopMeetings,
    fetchMeetings,
    createMeeting,
  };
};
