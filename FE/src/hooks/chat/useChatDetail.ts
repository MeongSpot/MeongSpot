import { useState, useEffect } from 'react';
import axiosInstance from '@/services/axiosInstance';
import { Chat, ChatPageResponse } from '@/types/singleChat';

const useChatDetail = (chatRoomId: number, page: number) => {
  const [messages, setMessages] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [myId, setMyId] = useState<number | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      if (isLastPage) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get<ChatPageResponse>(`/api/chat/rooms/${chatRoomId}`, {
          params: { page },
        });

        if (response.data.code === 'CH103') {
          const { myId, nickname, profileImage, chatMessageDtos } = response.data.data;
          const { content, last } = chatMessageDtos;

          setMyId(myId);
          setNickname(nickname);
          setProfileImage(profileImage);

          // 기존 메시지 목록에 새로 가져온 메시지 추가
          setMessages((prevMessages) => [ ...content, ...prevMessages,]);

          setIsLastPage(last);
          console.log(`채팅 메시지 불러오기 성공: 방 번호 ${chatRoomId}, 페이지 ${page}`, content);
        } else {
          setError(response.data.message || '채팅 메시지를 불러오는 데 실패했습니다.');
        }
      } catch (err) {
        setError('네트워크 오류가 발생했습니다.');
        console.error('API Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatRoomId, page]);

  return { messages, loading, error, isLastPage, myId, nickname, profileImage };
};

export default useChatDetail;
