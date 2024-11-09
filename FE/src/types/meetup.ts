// types/meetup.ts
import { LatLng } from '@/types/map';

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
