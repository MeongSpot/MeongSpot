import React, { useRef, useEffect, useState } from 'react';
import { FaUserFriends } from 'react-icons/fa';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location?: string;
  maxParticipants: number;
  currentParticipants: number;
  tags?: string[];
}

interface EventCardProps {
  event: Event;
  onClick: (roomId: number) => void;
}

const AllRoomListCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const [visibleTags, setVisibleTags] = useState<string[]>([]);
  const [remainingCount, setRemainingCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const renderDateTime = () => {
    const dateTime = `${event.date} ${event.time}`;
    return event.location ? `${dateTime} | ${event.location}` : dateTime;
  };

  useEffect(() => {
    const calculateVisibleTags = () => {
      if (!containerRef.current || !event.tags?.length) return;

      // 임시 요소를 만들어 태그 하나의 너비를 측정
      const tempTag = document.createElement('span');
      tempTag.className = 'text-xs text-deep-coral bg-cream-bg px-2 py-1 rounded-full';
      tempTag.style.position = 'absolute';
      tempTag.style.visibility = 'hidden';
      tempTag.innerHTML = event.tags[0];
      document.body.appendChild(tempTag);

      const tagWidth = tempTag.offsetWidth + 8; // gap 고려
      document.body.removeChild(tempTag);

      const containerWidth = containerRef.current.offsetWidth;
      const countBadgeWidth = 45; // +N 배지의 너비

      // 한 줄에 들어갈 수 있는 태그 수 계산 (배지 공간 확보)
      const maxTags = Math.floor((containerWidth - countBadgeWidth) / tagWidth);

      setVisibleTags(event.tags.slice(0, maxTags));
      setRemainingCount(Math.max(0, event.tags.length - maxTags));
    };

    calculateVisibleTags();
    window.addEventListener('resize', calculateVisibleTags);

    return () => window.removeEventListener('resize', calculateVisibleTags);
  }, [event.tags]);

  return (
    <div
      onClick={() => onClick(event.id)}
      className="bg-white p-4 rounded-lg shadow cursor-pointer min-h-[120px] flex flex-col"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">{event.title}</h2>
      </div>
      <p className="text-sm text-gray-500 mt-1">{renderDateTime()}</p>
      <div className="flex items-center text-sm text-gray-700 mt-2">
        <FaUserFriends className="mr-1" />
        <span>
          {event.currentParticipants}/{event.maxParticipants}
        </span>
      </div>
      {event.tags && event.tags.length > 0 && (
        <div className="flex flex-wrap mt-2 gap-2" ref={containerRef}>
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            {visibleTags.map((tag, index) => (
              <span key={index} className="text-xs text-deep-coral bg-cream-bg px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
                +{remainingCount}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllRoomListCard;
