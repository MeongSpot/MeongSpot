import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserProfileInfo } from "@/types/user";
import { profileService } from "@/services/profileService";

export const useProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserProfileInfo | null>(null);

  // 유저 프로필 정보 조회
  const getUserProfile = async (userId: number) => {
    try {
      const response = await profileService.getUserProfile(userId);
      setUserData(response.data);
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  };

  return { userData, isLoading, getUserProfile };
};
