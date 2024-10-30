import { useState } from 'react';
import SingleChatList from '@/components/chat/SingleChatList';
import GroupChatList from '@/components/chat/GrouptChatList';

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState('single');

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-center text-gray-800 mb-4">채팅</h1>
      <hr className="my-4" />
      <div className="flex justify-center border-b border-gray-300">
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === 'single' ? 'text-custom-orange border-b-2 border-light-orange' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('single')}
        >
          1:1 채팅
        </button>
        <button
          className={`flex-1 py-2 text-center ${
            activeTab === 'group' ? 'text-custom-orange border-b-2 border-light-orange' : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('group')}
        >
          모임 채팅
        </button>
      </div>
      <div className="flex-grow overflow-auto">{activeTab === 'single' ? <SingleChatList /> : <GroupChatList />}</div>
    </div>
  );
};

export default ChatPage;
