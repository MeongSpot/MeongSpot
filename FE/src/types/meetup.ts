// types/meeting.ts
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
  hashtag: string[];
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
  fetchTopMeetings: (spotId: number) => Promise<void>;
}

export interface MeetupEvent {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  participants: string[];
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
