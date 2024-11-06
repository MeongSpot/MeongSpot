// 채팅 목록 조회
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

// 채팅방 생성
export interface ChatRoomResponse {
  chatRoomId: number; 
}

export interface UseSingleChatCreateReturn {
  createChatRoom: (friendId: number) => Promise<void>;
  loading: boolean;
  error: string | null;
  chatRoomData: number | null; 
}

// 채팅방 상세 조회 
export interface Chat {
  message: string;
  nickname: string;
  profileImage: string;
  sentAt: string;
  messageType: string; 
}

export interface ChatPage { 
  content: Chat[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      unsorted: boolean;
      sorted: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  first: boolean;
  last: boolean;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    unsorted: boolean;
    sorted: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}