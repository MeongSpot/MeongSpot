import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { walkingLogService } from "@/services/walkingLogService";
import { MonthlyWalkingLogInfo, RecentWalkingLogInfo, WalkingLogDetailInfo } from "@/types/walkingLog";

export const useWalkingLog = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [monthlyWalkingLogs, setMonthlyWalkingLogs] = useState<MonthlyWalkingLogInfo[]>([]);
  const [recentWalkingLogs, setRecentWalkingLogs] = useState<RecentWalkingLogInfo[]>([]);
  const [selectedDogName, setSelectedDogName] = useState<string | null>(null);
  const [walkingLogDetail, setWalkingLogDetail] = useState<WalkingLogDetailInfo | null>(null);


  // 산책 기록 목록 조회
  const getWalkingLogList = async () => {
    setIsLoading(true);
    try {
      const walkingLogList = await walkingLogService.getWalkingLogList();
      setMonthlyWalkingLogs(walkingLogList.data.monthlyWalkingLogs);
      setRecentWalkingLogs(walkingLogList.data.recentWalkingLogs);
      setSelectedDogName(walkingLogList.data.monthlyWalkingLogs[0].dogName);
    } catch (error) {
      console.error("Failed to get walking logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 산책 기록 상세 조회
  const getWalkingLogDetail = async (walkingLogId: number) => {
    try {
      const walkingLogDetail = await walkingLogService.getWalkingLogDetail(walkingLogId);
      setWalkingLogDetail(walkingLogDetail.data);
    } catch (error) {
      console.error("Failed to get walking log detail:", error);
    }
  };

  return { isLoading, monthlyWalkingLogs, recentWalkingLogs, getWalkingLogList, selectedDogName, setSelectedDogName, walkingLogDetail, getWalkingLogDetail };
};
