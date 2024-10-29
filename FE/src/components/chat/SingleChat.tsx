import useChatStore from '@/store/chatStore';

const SingleChat = () => {
  const chats = useChatStore((state) => state.chats); // Zustand 스토어에서 채팅 데이터 가져오기

  return (
    <div>
      {chats.map((chat) => (
        <div key={chat.id} className="flex items-center py-4 border-b">
          <img src={chat.profileImage} alt={chat.name} className="w-12 h-12 rounded-full mr-4" />
          <div className="flex-1">
            <div className="font-bold">{chat.name}</div>
            <div className="text-gray-600">{chat.message}</div>
          </div>
          <div className="text-gray-400 text-sm">{chat.time}</div>
          <button className="ml-2">
            <i className="icon-more" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default SingleChat;
