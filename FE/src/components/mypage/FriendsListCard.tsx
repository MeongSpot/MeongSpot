import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';

interface Friend {
  id: number;
  name: string;
  profileImage: string | null;
  dogs: string[];
}

interface FriendsListCardProps {
  data: Friend[];
}

const FriendsListCard = ({ data }: FriendsListCardProps) => {
  return (
    <div>
      {data.map((friend) => (
        <div key={friend.id} className="py-4 border-b border-zinc-300">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-11 h-11 border rounded-full flex justify-center items-center">
                {friend.profileImage ? (
                  <img
                    className="w-9 h-9 rounded-full"
                    src={friend.profileImage}
                    alt={`${friend.name}의 프로필 사진`}
                  />
                ) : (
                  <img className="w-9 h-9" src="/icons/favicon/favicon-96x96.png" alt="기본 프로필 이미지" />
                )}
              </div>
              <p className="font-semibold text-sm">{friend.name}</p>
              <p>|</p>

              {friend.dogs.length > 0 && (
                <div className="flex space-x-1">
                  <p className="text-sm text-deep-coral font-medium">
                    {friend.dogs[0]}
                    {friend.dogs.length > 1 && ` 외 ${friend.dogs.length - 1}마리`}
                  </p>
                  <p className="text-sm text-zinc-600">견주</p>
                </div>
              )}
            </div>

            <div>
              <IoChatbubbleEllipsesOutline className="text-zinc-600" size={25} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendsListCard;
