import { useState, useEffect } from 'react';
import { ChatRoom, ChatRoomResponse } from '@/types/singleChat';

const useFetchSingleChatRooms = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatRooms = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/chat/rooms/friend', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('네트워크 오류가 발생했습니다.');
        }

        const data: ChatRoomResponse = await response.json();
        console.log('API 요청 성공:', data);

        if (data.code === 'CH100') {
          setChatRooms(data.data);
        } else {
          setError(data.message || '채팅 목록을 불러오는 데 실패했습니다.');
        }
      } catch (err) {
        setError('네트워크 오류가 발생했습니다.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, []);

  return { chatRooms, loading, error };
};

export default useFetchSingleChatRooms;
