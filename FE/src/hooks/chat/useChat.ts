import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import axiosInstance from '@/services/axiosInstance';
import useChatStore from '@/store/chatStore';
import { Chat } from '@/types/singleChat';

const useChat = (roomId: number) => {
  const chats = useChatStore((state) => state.chats[roomId] || []);
  const setChats = useChatStore((state) => state.setChats);
  const addChat = useChatStore((state) => state.addChat);

  // 채팅 데이터 API 호출
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axiosInstance.get(`/api/chat/rooms/${roomId}`);
        const data = response.data;
        setChats(roomId, data.chats); // 특정 방 번호에 맞는 채팅 데이터 설정
        console.log(`채팅 데이터 불러오기 성공: 방 번호 ${roomId}`, data);
      } catch (error) {
        console.error(`Failed to fetch chats for room ${roomId}:`, error);
      }
    };

    fetchChats();
  }, [roomId, setChats]);

  // WebSocket 연결 설정
  useEffect(() => {
    const client = new Client({
      brokerURL: `ws://your-websocket-url/ws`, // WebSocket 연결 주소
      onConnect: () => {
        console.log(`WebSocket 연결 성공: 방 번호 ${roomId}`);
        client.subscribe(`/topic/chat/${roomId}`, (message) => {
          if (message.body) {
            const newMessage: Chat = JSON.parse(message.body);
            addChat(roomId, newMessage); // 특정 방 번호에 새로운 메시지 추가
            console.log(`새 메시지 수신: 방 번호 ${roomId}`, newMessage);
          }
        });
      },
      onStompError: (frame) => {
        console.error(`WebSocket 연결 실패 (STOMP error): 방 번호 ${roomId}`, frame);
      },
      onWebSocketError: (error) => {
        console.error(`WebSocket 연결 오류: 방 번호 ${roomId}`, error);
      },
      onDisconnect: () => {
        console.log(`WebSocket 연결 해제: 방 번호 ${roomId}`);
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
