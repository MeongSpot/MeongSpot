import { useState } from 'react';
import axiosInstance from '@/services/axiosInstance';
import useChatStore from '@/store/chatStore';

const useDeleteChatRoom = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const removeChatRoom = useChatStore((state) => state.removeChatRoom);

  const deleteChatRoom = async (chatRoomId: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.delete(`/api/chat/rooms/${chatRoomId}`);
      const data = response.data

      console.log('채팅방 삭제 성공:', chatRoomId);

      removeChatRoom(chatRoomId);
    } catch (err) {
      console.error('채팅방 삭제 실패:', err);
      setError((err as Error).message || '채팅방 삭제에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return { deleteChatRoom, loading, error };
};

export default useDeleteChatRoom;
