import React, { useRef, useEffect, useState } from 'react';
import { FaUserFriends } from 'react-icons/fa';

const MeetupCard = ({ meetup }: { meetup: any }) => {
  const [visibleTags, setVisibleTags] = useState<string[]>([]);
  const [remainingCount, setRemainingCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const calculateVisibleTags = () => {
      if (!containerRef.current || meetup.tags.length === 0) return;

      // 임시 요소를 만들어 태그 하나의 너비를 측정
      const tempTag = document.createElement('span');
      tempTag.className = 'text-xs text-deep-coral bg-white border px-2 py-0.5 rounded-full';
      tempTag.style.position = 'absolute';
      tempTag.style.visibility = 'hidden';
      tempTag.innerHTML = '# ' + meetup.tags[0];
      document.body.appendChild(tempTag);

      const tagWidth = tempTag.offsetWidth + 4; // gap 고려
      document.body.removeChild(tempTag);

      const containerWidth = containerRef.current.offsetWidth;
      const countBadgeWidth = 45; // +N 배지의 너비

      // 한 줄에 들어갈 수 있는 태그 수 계산 (배지 공간 확보)
      const maxTags = Math.floor((containerWidth - countBadgeWidth) / tagWidth);

      setVisibleTags(meetup.tags.slice(0, maxTags));
      setRemainingCount(Math.max(0, meetup.tags.length - maxTags));
    };

    calculateVisibleTags();
    window.addEventListener('resize', calculateVisibleTags);

    return () => window.removeEventListener('resize', calculateVisibleTags);
  }, [meetup.tags]);

  return (
    <div className="bg-[#F6F6F6] p-4 rounded-lg border border-gray-100 shadow-sm flex flex-col min-h-[180px]">
      <div className="flex-1">
        <h3 className="text-base font-semibold truncate" title={meetup.title}>
          {meetup.title}
        </h3>
        <p className="text-sm text-gray-500 mt-1 truncate">
          {meetup.date} {meetup.time} | {meetup.location}
        </p>
        <div className="flex items-center text-sm text-gray-700 mt-2">
          <FaUserFriends className="mr-1" />
          <span>
            {meetup.currentParticipants}/{meetup.maxParticipants}
          </span>
        </div>
        <p className="text-sm text-gray-700 mt-2 truncate" title={`${meetup.participants.join(', ')}(이)와 함께`}>
          {meetup.participants.join(', ')}(이)와 함께
        </p>
      </div>

      <div className="mt-3" ref={containerRef}>
        <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap">
          {visibleTags.map((tag, index) => (
            <span key={index} className="inline-flex text-xs text-deep-coral bg-white border px-2 py-0.5 rounded-full">
              # {tag}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="inline-flex text-xs text-gray-500 bg-white border px-2 py-0.5 rounded-full flex-shrink-0">
              +{remainingCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetupCard;
