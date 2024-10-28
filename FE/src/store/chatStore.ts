// import create from 'zustand';
// import Chat from '@/types/SingleChat'

// // Zustand의 상태와 액션 타입 정의
// interface ChatState {
//   chats: Chat[]; // 채팅 메시지 리스트
//   setChats: (newChats: Chat[]) => void; // 채팅 메시지를 설정하는 함수
//   addChat: (chat: Chat) => void; // 새로운 채팅 메시지를 추가하는 함수
// }

// // Zustand store 생성
// const useChatStore = create<ChatState>((set) => ({
//   chats: [],

//   setChats: (newChats) => set(() => ({ chats: newChats })),

//   addChat: (chat) => set((state) => ({
//     chats: [...state.chats, chat], // 새로운 채팅을 기존 리스트에 추가
//   })),
// }));

// export default useChatStore;
