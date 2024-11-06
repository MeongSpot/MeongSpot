import { useState } from 'react';
import { UseSingleChatCreateReturn, ChatRoomResponse } from '@/types/singleChat';


const useSingleChatCreate = (): UseSingleChatCreateReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chatRoomData, setChatRoomData] = useState<number | null>(null);

  const createChatRoom = async (friendId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat/rooms/friend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ friendId }),
      });

      if (!response.ok) {
        throw new Error('채팅방 생성에 실패했습니다.');
      }

      const data: ChatRoomResponse = await response.json();

      setChatRoomData(data.chatRoomId); // chatRoomId를 chatRoomData에 저장
    } catch (err) {
      setError(err instanceof Error ? err.message : '채팅방 생성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { createChatRoom, loading, error, chatRoomData };
};

export default useSingleChatCreate;
