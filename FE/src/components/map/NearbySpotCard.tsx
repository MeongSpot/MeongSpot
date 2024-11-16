import { FaUserFriends } from 'react-icons/fa';
interface NearbySpotCardProps {
  spot: {
    id: number;
    name: string;
    distance: string;
    address: string;
    meetupCount: number;
    lat: number;
    lng: number;
  };
  onMove: () => void;
}

const NearbySpotCard = ({ spot, onMove }: NearbySpotCardProps) => (
  <div>
    <div className="bg-[#F6F6F6] border-gray-100 shadow-sm min-h-[8rem] rounded-lg px-4 py-6 mb-5">
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-lg">{spot.name}</h4>
        <span className="text-gray-500">{spot.distance}</span>
      </div>
      <hr className="mb-2" />
      <p className="text-gray-600 text-sm mb-3">{spot.address}</p>
      <div className="flex text-deep-coral gap-2 items-center">
        <FaUserFriends />
        모임 수 : {spot.meetupCount}개
      </div>
    </div>
    <button
      onClick={onMove}
      className="absolute bottom-0 right-6 bg-light-orange text-white px-10 py-2 rounded-full hover:bg-deep-coral transition-colors"
    >
      이동하기
    </button>
  </div>
);

export default NearbySpotCard;
