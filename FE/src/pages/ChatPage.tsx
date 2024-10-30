import SingleChatList from '@/components/chat/SingleChatList';

const ChatPage = () => {

  return (
    <div className="p-4">
      <h1 className="text-center text-lg font-bold mb-4">채팅</h1>
      <hr className="my-1" />
      <div className="flex-grow overflow-auto"><SingleChatList /></div>
    </div>
  );
};

export default ChatPage;
