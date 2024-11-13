// 알림 목록 조회
export interface Notification {
  notificationId: number;
  type: string;
  profileImage: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  friendId?: number;
  chatRoomId?: number;
}

export interface NotificationResponse {
  code: string;
  message: string;
  data: Notification[];
}

// 알림 삭제
export interface DeleteNotificationResponse {
  code: string;
  message: string;
}

// 알림 읽음
export interface MarkAsReadResponse {
  code: string;
  message: string;
}

// 안 읽은 알림
export interface CheckUnreadNotificationsResponse {
  code: string;
  message: string;
  body: {
      existUnread: boolean;
  };
}

// 친구 추가 알림
export interface RespondToInvitationResponse {
  code: string;
  message: string;
}