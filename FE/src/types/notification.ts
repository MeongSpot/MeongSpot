export interface NotificationInfo {
  notificationId: string;
  type: string;
  dogImage: string | null;
  content: string;
  createdAt : string;
  timeElapsed: string;
  isRead: boolean;
  friendId?: number;
  chatRoomId?: number;
}