import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import useChatStore from '@/store/chatStore.ts';
import { Chat } from '@/types/singleChat';

const useChat = (roomId: number) => {
  const chats = useChatStore((state) => state.chats[roomId] || []);
  const setChats = useChatStore((state) => state.setChats);
  const addChat = useChatStore((state) => state.addChat);

  // 채팅 데이터 API 호출
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`/api/chat/rooms/${roomId}`);
        const data = await response.json();
          setChats(roomId, data.chats); // 특정 방 번호에 맞는 채팅 데이터 설정
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      }
    };

    fetchChats();
  }, [roomId, setChats]);

  // WebSocket 연결 설정
  useEffect(() => {
    const client = new Client({
      brokerURL: `ws://your-websocket-url/ws`, // 연결주소 나중에 변경
      onConnect: () => {
        console.log(`연결된 방 번호 : ${roomId}`);
        client.subscribe(`/topic/chat/${roomId}`, (message) => {
          // 웹소켓 경로 주소 나중에 변경
          if (message.body) {
            const newMessage: Chat = JSON.parse(message.body);
            addChat(roomId, newMessage); // 특정 방 번호에 새로운 메시지 추가
          }
        });
      },
      onDisconnect: () => {
        console.log(`연결실패한 방번호 : ${roomId}`);
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
