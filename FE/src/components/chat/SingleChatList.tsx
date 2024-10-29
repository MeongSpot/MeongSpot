import useChatStore from '@/store/chatStore';

const SingleChatList = () => {
  const chatRooms = useChatStore((state) => state.chats); // 여러 채팅방 목록을 가져옴

  return (
    <div>
      {chatRooms.map((chatRoom) => {
        // 각 채팅방에서 마지막 메시지 가져오기
        const lastMessage = chatRoom.messages?.length > 0
          ? chatRoom.messages[chatRoom.messages.length - 1]
          : null;

        return (
          <div key={chatRoom.id} className="flex items-center py-4 border-b">
            <img src={chatRoom.profileImage} alt={chatRoom.name} className="w-12 h-12 rounded-full mr-4" />
            <div className="flex-1">
              <div className="font-bold">{chatRoom.name}</div>
              <div className="text-gray-600">
                {lastMessage ? lastMessage.message : 'No messages yet'}
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              {lastMessage ? lastMessage.time : ''}
            </div>
            <button className="ml-2">
              <i className="icon-more" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default SingleChatList;
