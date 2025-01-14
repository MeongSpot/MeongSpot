import { LatLng } from '@/types/map';

export interface MeetingHashtag {
  hashtagId: number;
  content: string;
}

export interface Meeting {
  meetingId: number;
  title: string;
  participants: number;
  maxParticipants: number;
  meetingAt: string;
  detailLocation: string;
  hashtags: string[];
}

export interface TopMeetingsResponse {
  code: string;
  message: string;
  data: {
    spotName: string;
    meetings: Meeting[];
  };
}

export interface MeetupCardProps {
  meetup: {
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    maxParticipants: number;
    currentParticipants: number;
    tags: string[];
  };
}

export interface MeetingState {
  meetings: Meeting[];
  spotName: string;
  isLoading: boolean;
  error: string | null;
}

export interface UseMeetingReturn {
  meetings: Meeting[];
  spotName: string;
  isLoading: boolean;
  error: string | null;
  meetingDetail: MeetingDetailInfo | null;
  hashtags: string[];
  dogImages: DogImage[];
  fetchTopMeetings: (spotId: number) => Promise<void>;
  fetchMeetings: (spotId: number, order: OrderType) => Promise<void>;
  createMeeting: (data: CreateMeetingRequest) => Promise<void>;
  fetchMeetingDetail: (meetingId: string) => Promise<void>;
}

export interface MeetupEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  participants?: string[];
  maxParticipants: number;
  currentParticipants: number;
  tags: string[];
}

export interface SpotInfo {
  id: number;
  position: LatLng;
  content: string;
  meetups: MeetupEvent[];
}

export interface SpotModalProps {
  isOpen: boolean;
  onClose: () => void;
  spot: SpotInfo | null;
  onNavigateToAll: () => void;
}

export interface MeetingListResponse {
  code: string;
  message: string;
  data: Meeting[];
}

export type OrderType = 'recent' | 'remain';

export interface CreateMeetingRequest {
  spotId: number;
  title: string;
  date: string;
  hour: number;
  minute: number;
  detailLocation: string;
  information: string;
  hashtags: string[];
  maxParticipants: number;
  dogIds: number[];
}
export interface JoinMeetingResponse {
  code: string;
  message: string;
  data: null;
}

export interface CreateMeetingResponse {
  code: string;
  message: string;
  data: null;
}

export interface MeetingDetailInfo {
  title: string;
  participants: number;
  maxParticipants: number;
  meetingAt: string;
  detailLocation?: string;
  information?: string;
  isParticipate: boolean;
}

export interface MeetingDetailResponse {
  code: string;
  message: string;
  data: MeetingDetailInfo;
}

export interface HashtagResponse {
  code: string;
  message: string;
  data: string[];
}

// 타입 정의도 업데이트
export interface DogImage {
  dogId: number;
  memberId: number;
  profileImage: string;
}

export interface DogImagesResponse {
  code: string;
  message: string;
  data: DogImage[];
}

export interface MyMeeting {
  meetingId: number;
  title: string;
  participants: number;
  maxParticipants: number;
  meetingAt: string;
  spotName: string;
  hashtags: string[];
  chatRoomId: number;
  unreadMessageCnt: number;
}

export interface MyMeetingResponse {
  code: string;
  message: string;
  data: MyMeeting[];
}

export interface LeaveMeetingResponse {
  code: string;
  message: string;
  data: null;
}
