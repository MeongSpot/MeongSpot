import { useState, useEffect } from 'react';
import { UseSingleChatCreateReturn, ChatRoomCreateResponse } from '@/types/singleChat';
import axiosInstance from '@/services/axiosInstance';

const useSingleChatCreate = (): UseSingleChatCreateReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatRoomData, setChatRoomData] = useState<number | null>(null);

  const createChatRoom = async (interlocutorId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post<ChatRoomCreateResponse>('/api/chat/rooms', {
        interlocutorId,
      });

      if (response.data.code !== 'CH101') {
        throw new Error(response.data.message || '채팅방 생성에 실패했습니다.');
      }

      // 상태 업데이트
      setChatRoomData(response.data.data);
      console.log('chatRoomId:', response.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '채팅방 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { createChatRoom, loading, error, chatRoomData };
};

export default useSingleChatCreate;
