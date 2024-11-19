// types/walking.ts
export interface WalkingLog {
  id: number;
  dogIds: number[];
  startTime: string;
  endTime?: string;
  distance?: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
}

export interface WalkingLocationPayload {
  loginId: string;
  lat: number;
  lng: number;
}

export interface StartWalkingRequest {
  dogIds: number[];
}

export interface StartWalkingResponse {
  code: string;
  message: string;
  data: null;
}

export const WALKING_API_CODE = {
  START_SUCCESS: 'WK100',
  END_SUCCESS: 'WK102',
} as const;
