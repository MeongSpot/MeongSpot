import { create } from 'zustand';
import { Chat } from '@/types/singleChats';

// Zustand의 상태와 액션 타입 정의
interface ChatState {
  chats: { [roomId: string]: Chat[] }; // 각 채팅방의 메시지 리스트
  setChats: (roomId: string, newChats: Chat[]) => void; // 특정 채팅방의 메시지를 설정하는 함수
  addChat: (roomId: string, chat: Chat) => void; // 특정 채팅방에 새로운 채팅 메시지를 추가하는 함수
}

const useChatStore = create<ChatState>((set) => ({
  chats: {},

  setChats: (roomId, newChats) =>
    set((state) => ({
      chats: {
        ...state.chats,
        [roomId]: newChats, // 특정 채팅방의 메시지 리스트를 설정
      },
    })),

  addChat: (roomId, chat) =>
    set((state) => ({
      chats: {
        ...state.chats,
        [roomId]: [...(state.chats[roomId] || []), chat], // 특정 채팅방에 새로운 메시지 추가
      },
    })),
}));

export default useChatStore;
