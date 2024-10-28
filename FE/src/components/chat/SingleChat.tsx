const SingleChat = () => {
    const chats = [ // 임시 더미데이터
      {
        id: 1,
        name: '뽀삐언니',
        message: '다음에 또 같이 산책해요~~',
        time: '17:35',
        profileImage: 'path-to-image1.png',
      },
      {
        id: 2,
        name: '로나',
        message: '죄송해요ㅠㅠ 오늘 못가겠네요..',
        time: '어제',
        profileImage: 'path-to-image2.png',
      },
    ];
  
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
  