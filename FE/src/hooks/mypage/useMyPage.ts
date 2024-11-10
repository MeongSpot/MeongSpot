import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { myPageService } from "@/services/myPageService";
import { UserMyPageInfo } from "@/types/user";

export const useMyPage = () => {
  const navigate = useNavigate();
  const [isUserLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserMyPageInfo | null>(null);
  const [nickname, setNickname] = useState<string>("");
  const [profileImage, setProfileImage] = useState<string>('');

  // 마이페이지 유저 정보 조회
  const getMyPageUser = async () => {
    setIsLoading(true);
    try {
      const user = await myPageService.getMyPage();
      setUserData(user.data);
      setNickname(user.data.nickname);
      setProfileImage(user.data.profileImage);
    } catch (error) {
      console.error("Failed to get mypage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 마이페이지 유저 프로필 이미지 수정
  const updateProfileImage = async (formData: FormData) => {
    setIsLoading(true);
    try {
      await myPageService.updateProfileImage(formData);
      navigate("/mypage");
    } catch (error) {
      console.error("Failed to update profile image:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { getMyPageUser, updateProfileImage, userData, isUserLoading, nickname, setNickname, profileImage, setProfileImage };
};
