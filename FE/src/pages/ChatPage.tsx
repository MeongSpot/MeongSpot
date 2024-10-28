import { useState } from 'react';
import SingleChat from '@/components/chat/SingleChat';
import GroupChat from '@/components/chat/GrouptChat';

const ChatPage = () => {
  const [activeTab, setActiveTab] = useState('single');

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">채팅</h1>
      <div className="flex justify-center mb-4">
        <button
          className={`py-2 px-4 ${activeTab === 'single' ? 'text-custom-orange' : 'text-gray-400'}`}
          onClick={() => setActiveTab('single')}
        >
          1:1 채팅
        </button>
        <button
          className={`py-2 px-4 ${activeTab === 'group' ? 'text-custom-orange' : 'text-gray-400'}`}
          onClick={() => setActiveTab('group')}
        >
          모임 채팅
        </button>
      </div>
      <hr className="my-4" />
      {activeTab === 'single' ? <SingleChat /> : <GroupChat />}
    </div>
  );
};

export default ChatPage;
