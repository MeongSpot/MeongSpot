import { useCallback } from 'react';
import { debounce } from 'lodash';
import axiosInstance from '@/services/axiosInstance';

const useMarkRead = (chatRoomId: number) => {
  const markAsRead = useCallback(async () => {
    try {
      await axiosInstance.patch(`/api/chat/message-read?chatRoomId=${chatRoomId}`);
      console.log(`채팅방 ${chatRoomId}의 메시지를 읽음 처리했습니다.`);
    } catch (error) {
      console.error(`채팅방 ${chatRoomId}에 대한 읽음 처리 실패:`, error);
    }
  }, [chatRoomId]);

  const debouncedMarkAsRead = useCallback(debounce(markAsRead, 300), [markAsRead]);

  return debouncedMarkAsRead;
};

export default useMarkRead;
