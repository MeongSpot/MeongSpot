import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import useChatStore from '@/store/chatStore.ts';
// import apiClient from '@/services/apiClient';
import { Chat } from '@/types/SingleChat';

// useChat 훅 타입 정의
const useChat = (dogId: number) => {
  const chats = useChatStore((state) => state.chats as Chat[]);
  const setChats = useChatStore((state) => state.setChats);
  const addChat = useChatStore((state) => state.addChat);

  // 채팅 데이터 API 호출
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await apiClient.get<{ chats: Chat[] }>(`/api/v1/chats/${dogId}`);
        setChats(response.data.chats); // 서버에서 받아온 채팅 데이터 설정
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      }
    };

    fetchChats();
  }, [dogId, setChats]);

  // WebSocket 연결 설정
  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://your-websocket-url/ws',
      onConnect: () => {
        console.log('Connected to WebSocket server');
        client.subscribe(`/topic/chat/${dogId}`, (message) => {
          if (message.body) {
            const newMessage: Chat = JSON.parse(message.body);
            addChat(newMessage);
          }
        });
      },
      onDisconnect: () => {
        console.log('Disconnected from WebSocket server');
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [dogId, addChat]);

  return { chats };
};

export default useChat;
