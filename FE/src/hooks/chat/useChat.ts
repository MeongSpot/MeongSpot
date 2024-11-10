import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import axiosInstance from '@/services/axiosInstance';
import useChatStore from '@/store/chatStore';
import { Chat } from '@/types/singleChat';

const useChat = (roomId: number) => {
  const setChats = useChatStore((state) => state.setChats);
  const addChat = useChatStore((state) => state.addChat);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axiosInstance.get(`/api/chat/rooms/${roomId}`);
        setChats(roomId, response.data.chats);
        console.log(`채팅 데이터 불러오기 성공: 방 번호 ${roomId}`, response.data);
      } catch (error) {
        console.error(`Failed to fetch chats for room ${roomId}:`, error);
      }
    };

    fetchChats();
  }, [roomId, setChats]);

  useEffect(() => {

    if (clientRef.current) {
      clientRef.current.deactivate();
    }

    const client = new Client({
      brokerURL: `wss://meongspot.kro.kr/socket/chat/ws`,
      reconnectDelay: 5000,
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
      
      onConnect: () => {
        console.log(`WebSocket 연결 성공: 방 번호 ${roomId}`);
        client.subscribe(`/exchange/chat.exchange/room.${roomId}`, (message) => {
          if (message.body) {
            const newMessage: Chat = JSON.parse(message.body);
            addChat(roomId, newMessage);
            console.log(`새 메시지 수신: 방 번호 ${roomId}`, newMessage);
          }
        });
      },
      onStompError: (frame) => {
        console.error(`WebSocket 연결 실패 (STOMP error): 방 번호 ${roomId}`, frame);
      },
      onWebSocketError: (error) => {
        console.error(`WebSocket 연결 오류: 방 번호 ${roomId}`, error);
        setTimeout(() => client.activate(), 5000); // 오류 발생 시 5초 후 재연결 시도
      },
      onDisconnect: () => {
        console.log(`WebSocket 연결 해제: 방 번호 ${roomId}`);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      if (clientRef.current?.connected) {
        clientRef.current.deactivate();
      }
    };
  }, [roomId, addChat]);

  const sendMessage = (message: string, myId: number) => {
    if (clientRef.current?.connected) {
      const chatMessage = {
        memberId: myId,
        chatRoomId: roomId,
        roomId,
        senderId: myId,
        message,
        timestamp: new Date().toISOString(),
      };

      clientRef.current.publish({
        destination: `/pub/send.message.${roomId}`,
        body: JSON.stringify(chatMessage),
      });

      console.log(`메시지 전송 성공: ${message}`, chatMessage);
    } else {
      console.error('WebSocket이 연결되지 않았습니다. 메시지를 보낼 수 없습니다.');
    }
  };

  return { sendMessage };
};

export default useChat;
