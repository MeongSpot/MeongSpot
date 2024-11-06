import useChatStore from '@/store/chatStore';

const Chat = ({ roomId, userClick }: { roomId: number, userClick: (userId: number) => void }) => {
  const chats = useChatStore((state) => state.chats[roomId] || []); // Zustand 스토어에서 채팅 데이터 가져오기

  return (
    <div>
      {chats.map((chat) => (
        <div key={chat.nickname} className="flex items-center py-4 border-b">
          <img src={chat.profileImage} alt={chat.nickname} className="w-12 h-12 rounded-full mr-4"/> {/* 여기다가 그사람 마이페이지 이동 경로 등록 */}
          <div className="flex-1">
            <div className="font-bold">{chat.nickname}</div>
            <div className="text-gray-600">{chat.message}</div>
          </div>
          <div className="text-gray-400 text-sm">{new Date(chat.sentAt).toLocaleTimeString()}</div>
          <button className="ml-2">
            <i className="icon-more" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Chat;
