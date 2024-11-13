import { useState, useEffect } from 'react';
import { ChatRoom, ChatRoomResponse } from '@/types/singleChat';
import axiosInstance from '@/services/axiosInstance';

const useFetchSingleChatRooms = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatRooms = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get<ChatRoomResponse>('/api/chat/rooms');

        if (response.data.code === 'CH100') {
          setChatRooms(response.data.data);
          console.log(response.data);
        } else {
          setError(response.data.message || '채팅 목록을 불러오는 데 실패했습니다.'); //
        }
      } catch (err) {
        setError('네트워크 오류가 발생했습니다.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
    const intervalId = setInterval(fetchChatRooms, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return { chatRooms, loading, error, setChatRooms };
};

export default useFetchSingleChatRooms;
