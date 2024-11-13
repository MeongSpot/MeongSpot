import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserSearchInfo, MeetingParticipantsInfo } from "@/types/user";
import { profileService } from "@/services/profileService";
import { userService } from "@/services/userService";

export const useUser = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [searchedUser, setSearchedUser] = useState<UserSearchInfo[] | null>(null);
  const [meetingParticipants, setMeetingParticipants] = useState<MeetingParticipantsInfo[] | null>(null);

  // 사용자 검색
  const searchUser = async (nickname: string) => {
    setIsLoading(true);
    try {
      const response = await userService.searchUser(nickname);
      setSearchedUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to search user:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 모임 참여 사용자 조회
  const getMeetingParticipants = async (meetingId: number) => {
    setIsLoading(true);
    try {
      const response = await userService.getMeetingParticipants(meetingId);
      setMeetingParticipants(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to get meeting participants:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { searchedUser, isLoading, searchUser, meetingParticipants, getMeetingParticipants };
};
