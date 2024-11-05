export interface ChatRoom {
  chatRoomId: number;
  friend: string;
  friendDogImage: string;
  lastMessage: string;
  lastMessageSentAt: string;
}

export interface ChatRoomResponse {
  code: string;
  message: string;
  data: ChatRoom[];
}
