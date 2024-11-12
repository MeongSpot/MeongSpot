import { create } from 'zustand';
import { Chat } from '@/types/singleChat';
import { subscribeWithSelector } from 'zustand/middleware';

interface ChatState {
  chats: { [roomId: number]: Chat[] }; // 각 채팅방의 메시지 리스트
  setChats: (roomId: number, newChats: Chat[]) => void; // 특정 채팅방의 메시지를 설정하는 함수
  addChat: (roomId: number, chat: Chat) => void; // 특정 채팅방에 새로운 채팅 메시지를 추가하는 함수
  removeChatRoom: (roomId: number) => void;
  getChatsByRoomId: (roomId: number) => Chat[] | undefined;
}

const useChatStore = create<ChatState>()(
  subscribeWithSelector((set, get) => ({
    chats: {},

    setChats: (roomId, newChats) => {
      set((state) => {
        const updatedChats = {
          ...state.chats,
          [roomId]: newChats,
        };
        console.log("Setting chats for room:", roomId, updatedChats); // 상태 확인
        return { chats: updatedChats };
      });
    },

    addChat: (roomId, chat) =>
      set((state) => ({
        chats: {
          ...state.chats,
          [roomId]: [...(state.chats[roomId] || []), chat],
        },
      })),

    removeChatRoom: (roomId) =>
      set((state) => {
        const { [roomId]: _, ...remainingChats } = state.chats;
        return { chats: remainingChats };
      }),
    getChatsByRoomId: (roomId) => get().chats[roomId],
  }))
);

export default useChatStore;
