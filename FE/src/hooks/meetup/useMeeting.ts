// hooks/meeting/useMeeting.ts
import { useState, useCallback } from 'react';
import type { Meeting, UseMeetingReturn, OrderType } from '@/types/meetup';
import { meetingService } from '@/services/meetingService';

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

  return {
    meetings,
    spotName,
    isLoading,
    error,
    fetchTopMeetings,
    fetchMeetings,
  };
};
