// 채팅 목록 조회
export interface ChatRoom {
  chatRoomId: number;
  interlocutorNickname: string;
  interlocutorProfileImage: string;
  lastMessage: string;
  lastMessageSentAt: string;
  unreadMessageCnt: number;
}

export interface ChatRoomResponse {
  code: string;
  message: string;
  data: ChatRoom[];
}

// 채팅방 생성
export interface ChatRoomCreateResponse {
  code: string;
  message: string;
  data: number;
}

export interface UseSingleChatCreateReturn {
  createChatRoom: (friendId: number) => Promise<void>;
  loading: boolean;
  error: string | null;
  chatRoomData: number | null;
}

// 채팅방 상세 조회 
export interface Chat {
  senderId: number;
  message: string;
  nickname: string;
  profileImage: string | null;
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
    paged: boolean;
    unpaged: boolean;
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

export interface ChatPageResponse {
  code: string;
  message: string;
  data: {
    myId: number;
    nickname: string;
    profileImage: string | null;
    chatMessageDtos: ChatPage;
  };
}
