import { useState } from "react";
import { myPageService } from "@/services/myPageService";
import { UserMyPageInfo } from "@/types/user";

export const useMyPage = () => {
  const [isUserLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserMyPageInfo | null>(null);

  // 마이페이지 유저 정보 조회
  const getMyPageUser = async () => {
    setIsLoading(true);
    try {
      const user = await myPageService.getMyPage();
      setUserData(user.data);
    } catch (error) {
      console.error("Failed to get mypage:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { getMyPageUser, userData, isUserLoading };
};
