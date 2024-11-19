import { useState } from "react";
import axiosInstance from "@/services/axiosInstance";
import { LeaveMeetingResponse } from "@/types/meetup";

export const useLeaveMeeting = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const leaveMeeting = async (meetingId: number) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await axiosInstance.delete<LeaveMeetingResponse>(`/api/meetings/${meetingId}`);
      const { code, message } = response.data;

      if (code === "MT106") {
        setSuccessMessage(message); // "모임 나가기 성공"
      } else {
        setError("알 수 없는 오류가 발생했습니다.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "모임 나가기 요청에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return { leaveMeeting, loading, error, successMessage };
};
