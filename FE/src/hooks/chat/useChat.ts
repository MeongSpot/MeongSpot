import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import useChatStore from '@/store/chatStore';
import { Chat } from '@/types/singleChat';
import { debounce } from 'lodash';
import useMarkRead from './useMarkRead';

const useChat = (roomId: number, isGroupChat = false, nickname?: string) => {
  const addChat = useChatStore((state) => state.addChat);
  const clientRef = useRef<Client | null>(null);
  const markAsRead = useMarkRead(roomId);

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
            markAsRead();
            console.log(`새 메시지 수신: 방 번호 ${roomId}`, newMessage);
          }
        });

        if (isGroupChat) {
          // 입장 메시지를 전송하면서 닉네임을 백엔드에서 받은 값으로 바로 전달
          client.publish({
            destination: `/pub/enter.room.${roomId}`,
            body: JSON.stringify({ nickname }), // 백엔드에서 전달된 닉네임을 그대로 사용
          });
          console.log(`입장 메시지 전송: 방 번호 ${roomId}, 닉네임: ${nickname}`);
        }
      },
      onStompError: (frame) => {
        console.error(`WebSocket 연결 실패 (STOMP error): 방 번호 ${roomId}`, frame);
      },
      onWebSocketError: (error) => {
        console.error(`WebSocket 연결 오류: 방 번호 ${roomId}`, error);
        setTimeout(() => client.activate(), 2000); // 오류 발생 시 5초 후 재연결 시도
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
  }, [roomId, addChat, isGroupChat]);

  const sendMessage = useCallback(
    debounce((message: string, myId: number) => {
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
    }, 300),
    [roomId],
  );
  return { sendMessage };
};

export default useChat;
