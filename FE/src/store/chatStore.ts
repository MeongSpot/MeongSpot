import { create } from 'zustand';
import { Chat } from '@/types/singleChat';

interface ChatState {
  chats: { [roomId: number]: Chat[] }; // 각 채팅방의 메시지 리스트
  setChats: (roomId: number, newChats: Chat[]) => void; // 특정 채팅방의 메시지를 설정하는 함수
  addChat: (roomId: number, chat: Chat) => void; // 특정 채팅방에 새로운 채팅 메시지를 추가하는 함수
  removeChatRoom: (roomId: number) => void;
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

  removeChatRoom: (roomId) =>
    set((state) => {
      const { [roomId]: _, ...remainingChats } = state.chats; // 삭제할 채팅방 제외
      return { chats: remainingChats }; // 남은 채팅방 상태로 업데이트
    }),
}));

export default useChatStore;
