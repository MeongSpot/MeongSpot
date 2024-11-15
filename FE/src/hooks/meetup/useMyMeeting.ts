import { useState, useEffect } from "react";
import axiosInstance from '@/services/axiosInstance';
import { MyMeeting, MyMeetingResponse } from "@/types/meetup";

export const useMyMeeting = () => {
  const [meetings, setMeetings] = useState<MyMeeting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get<MyMeetingResponse>("/api/meetings/my");
        setMeetings(response.data.data);
        setError(null);
      } catch (error: any) {
        setError(error.response?.data?.message || "모임 목록 조회에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  return { meetings, loading, error };
};
