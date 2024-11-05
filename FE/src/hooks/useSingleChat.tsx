import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import useChatStore from '@/store/chatStore.ts';
// import apiClient from '@/services/apiClient'
import { Chat } from '@/types/singleChat';

const useChat = (roomId: string) => {
  const chats = useChatStore((state) => state.chats[roomId] || []);
  const setChats = useChatStore((state) => state.setChats);
  const addChat = useChatStore((state) => state.addChat);

  // 채팅 데이터 API 호출
  // useEffect(() => {
  //   const fetchChats = async () => {
  //     try {
  //       const response = await apiClient.get<{ chats: Chat[] }>(`/api/v1/chats/${roomId}`);
  //       setChats(roomId, response.data.chats); // 특정 방 번호에 맞는 채팅 데이터 설정
  //     } catch (error) {
  //       console.error('Failed to fetch chats:', error);
  //     }
  //   };

  //   fetchChats();
  // }, [roomId, setChats]);

  // WebSocket 연결 설정
  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://your-websocket-url/ws',
      onConnect: () => {
        console.log(`Connected to WebSocket server for room ${roomId}`);
        client.subscribe(`/topic/chat/${roomId}`, (message) => {
          if (message.body) {
            const newMessage: Chat = JSON.parse(message.body);
            addChat(roomId, newMessage); // 특정 방 번호에 새로운 메시지 추가
          }
        });
      },
      onDisconnect: () => {
        console.log(`Disconnected from WebSocket server for room ${roomId}`);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [roomId, addChat]);

  return { chats };
};

export default useChat;
