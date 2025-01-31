import { useEffect } from 'react';
import DogCard from '@/components/meetUp/DogListCard';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { useMeeting } from '@/hooks/meetup/useMeeting';
import { useUser } from '@/hooks/user/useUser';
import { useDog } from '@/hooks/dog/useDog';
import LoadingOverlay from '@/components/common/LoadingOverlay'; // 경로는 실제 구조에 맞게 수정해주세요
import { group } from 'console';

const MeetUpDogListPage = () => {
  const { id } = useParams();
  const { meetingDetail, hashtags, dogImages, isLoading, error, fetchMeetingDetail } = useMeeting();
  const { getMeetingParticipants, meetingParticipants } = useUser();

  const navigate = useNavigate();
  const location = useLocation();
  const animateBack = location.state?.animateBack ?? true;
  const fromChat = location.state?.fromChat;
  const roomId = location.state?.roomId;
  const fromList = location.state?.fromList;
  const previousPath = location.state?.previousPath;
  const spotName = location.state?.spotName;
  const fromModal = location.state?.fromModal;

  console.log('룸 아이디', roomId);

  const handleBack = () => {
    if (fromChat) {
      // 채팅방에서 왔을 경우
      navigate(`/chat/group/${roomId}`, {
        state: {
          animateBack: true,
          meetingId: id, // 다시 채팅방으로 갈 때 meetingId도 전달
          roomId,
          groupName: meetingDetail?.title,
        },
      });
    } else {
      // ParticipateDog 페이지에서 왔을 경우\
      navigate(`/participatedog/${id}`, {
        state: {
          animateBack: true,
          fromList,
          fromModal,
          previousPath,
          spotName,
          fromDogList: true,
        },
      });
    }
  };

  // title이 15자를 초과하면 '...'을 추가하여 표시
  const truncatedTitle = (title: string) => {
    if (title.length > 15) {
      return `${title.slice(0, 15)}...`;
    } else {
      return title;
    }
  };

  useEffect(() => {
    if (id) {
      fetchMeetingDetail(id);
      getMeetingParticipants(Number(id));
    }
  }, [id, fetchMeetingDetail]);

  if (isLoading) {
    return <LoadingOverlay />;
  }

  if (error || !meetingDetail || !meetingParticipants) {
    return (
      <motion.div className="absolute inset-0 z-50 bg-gray-200  flex items-center justify-center">
        <div className="text-red-500">{error || 'Failed to load meeting details'}</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={animateBack ? { x: -300, opacity: 0 } : { x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={animateBack ? { x: 300, opacity: 0 } : { x: -300, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex items-center bg-deep-coral text-white p-4">
        <button onClick={handleBack} className="mr-3">
          <IoChevronBack size={24} />
        </button>
        <h1 className="text-lg font-bold">{truncatedTitle(meetingDetail.title)}</h1>
      </div>
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">
          참여 멤버
          <span className="text-deep-coral"> {meetingParticipants.length}</span>
        </h2>
        {meetingParticipants.map((member) => (
          <DogCard
            key={member.memberId}
            member={member}
            meetingId={Number(id)}
            fromList={fromList}
            fromModal={fromModal}
            fromChat={fromChat}
            previousPath={previousPath}
            spotName={spotName}
            roomId={roomId}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default MeetUpDogListPage;
