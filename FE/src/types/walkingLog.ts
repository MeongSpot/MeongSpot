export interface MonthlyWalkingLogInfo {
  dogImage: string;
  dogName: string;
  monthlyWalkCount: number | null;
  monthlyWalkTime: number | null;
  monthlyWalkDistance: number | null;
}

export interface RecentWalkingLogInfo {
  walkingLogId: number;
  date: string;
  dogImage: string;
  dogName: string;
  time: number | null;
  distance: number | null;
}

export interface WalkingLogListResponse {
  code: string;
  message: string;
  data: {
    monthlyWalkingLogs: MonthlyWalkingLogInfo[];
    recentWalkingLogs: RecentWalkingLogInfo[];
  }
}

export interface WalkingLogDetailInfo {
  startedAt: string;
  finishedAt: string;
  dogImage: string;
  dogName: string;
  time: number | null;
  distance: number | null;
  trail: {
    lat: number;
    lng: number;
  }[];
}

export interface WalkingLogDetailResponse {
  code: string;
  message: string;
  data: WalkingLogDetailInfo;
}
