import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useMeeting } from '@/hooks/meetup/useMeeting';
import LoadingOverlay from '@/components/common/LoadingOverlay'; // 경로는 실제 구조에 맞게 수정해주세요
import JoinConfirmationModal from '@/components/meetUp/JoinConfirmationModal';
import JoinSuccessModal from '@/components/meetUp/JoinSuccessModal';

const ParticipateDogPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fromModal = location.state?.fromModal;
  const fromList = location.state?.fromList;
  const previousPath = location.state?.previousPath;
  const animateBack = location.state?.animateBack ?? false;
  const spotName = location.state?.spotName;
  const [selectedDogs, setSelectedDogs] = useState<number[]>([]);
  const { meetingDetail, hashtags, dogImages, isLoading, error, fetchMeetingDetail } = useMeeting();
  const [isExpanded, setIsExpanded] = useState(false);
  const { meetingDate, meetingTime } = useMemo(() => {
    if (!meetingDetail) {
      return { meetingDate: '', meetingTime: '' };
    }
    const date = format(new Date(meetingDetail.meetingAt), 'yyyy-MM-dd');
    const time = format(new Date(meetingDetail.meetingAt), 'a h:mm', { locale: ko });
    return { meetingDate: date, meetingTime: time };
  }, [meetingDetail]);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    if (roomId) {
      fetchMeetingDetail(roomId);
    }
  }, [roomId, fetchMeetingDetail]);

  // handleJoinClick 수정
  const handleJoinClick = useCallback(() => {
    setShowJoinModal(true);
  }, []);

  const handleDogSelect = useCallback((dogId: number) => {
    setSelectedDogs((prev) => (prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]));
  }, []);

  // 모달 확인 핸들러 추가
  const handleConfirmJoin = useCallback(() => {
    setShowJoinModal(false);
    setShowSuccessModal(true);
  }, []);

  // 성공 모달의 모임으로 가기 버튼 핸들러
  const handleGoToChat = useCallback(() => {
    setShowSuccessModal(false);
    navigate(`/chat/group/${roomId}`, {
      state: {
        animateBack: true,
        spotName,
        selectedDogs,
      },
    });
  }, [navigate, roomId, spotName, selectedDogs]);

  // 성공 모달의 취소 버튼 핸들러
  const handleCancelSuccess = useCallback(() => {
    setShowSuccessModal(false);
    navigate('/meeting');
  }, [navigate]);

  const handleBack = useCallback(() => {
    // MeetUpDogListPage에서 돌아온 경우
    if (location.state?.fromDogList) {
      if (fromModal) {
        navigate('/meeting', { state: { animateBack: true } });
      } else if (fromList) {
        navigate(previousPath || -1, {
          state: {
            spotName,
            fromDetail: true,
          },
        });
      }
    }
    // 일반적인 뒤로가기
    else {
      if (fromList) {
        navigate(previousPath || -1, {
          state: {
            spotName,
            fromDetail: true,
          },
        });
      } else if (fromModal) {
        navigate('/meeting', { state: { animateBack: true } });
      } else {
        navigate(-1);
      }
    }
  }, [navigate, fromList, fromModal, previousPath, spotName, location.state]);

  const detailClick = useCallback(() => {
    navigate(`/meetupdoglist/${roomId}`, {
      state: {
        animateBack: false,
        fromList, // 현재 페이지의 fromList 전달
        fromModal, // fromModal 상태도 전달
        previousPath, // 현재 페이지의 previousPath 전달
        spotName, // 현재 페이지의 spotName 전달
      },
    });
  }, [navigate, roomId, fromList, fromModal, previousPath, spotName]);

  // 뒤로가기 애니메이션 설정
  const backAnimation = animateBack
    ? {
        initial: { x: -300 },
        animate: { x: 0 },
        exit: { x: 300 },
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        },
      }
    : {
        initial: { x: 300 },
        animate: { x: 0 },
        exit: { x: -300 },
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        },
      };

  // 애니메이션 설정
  const slideAnimation = fromList
    ? {
        initial: { y: '100%' },
        animate: { y: 0 },
        exit: { y: '100%' },
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        },
      }
    : {
        initial: { x: 300 },
        animate: { x: 0 },
        exit: { x: -300 },
        transition: {
          type: 'spring',
          stiffness: 300,
          damping: 30,
        },
      };

  const containerAnimation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 1 },
    transition: { duration: 0.3 },
  };

  if (isLoading) {
    return (
      <motion.div className="absolute inset-0 z-50 bg-gray-200 ">
        <LoadingOverlay />
      </motion.div>
    );
  }

  if (error || !meetingDetail) {
    return (
      <motion.div className="absolute inset-0 z-50 bg-gray-200  flex items-center justify-center">
        <div className="text-red-500">{error || 'Failed to load meeting details'}</div>
      </motion.div>
    );
  }

  return (
    <motion.div {...containerAnimation} className="absolute inset-0 z-50 bg-gray-100">
      <motion.div
        {...backAnimation}
        className="absolute inset-0 bottom-0 top-0 bg-gray-200 overflow-hidden flex flex-col"
      >
        <div className="flex items-center bg-deep-coral text-white p-4">
          <h1 className="text-lg font-bold flex-1 text-center">
            {spotName ? <span className="text-white">{spotName}</span> : '모임 가입'}
          </h1>
          <button onClick={handleBack} className="flex justify-end">
            <IoClose size={24} />
          </button>
        </div>
        <div className="p-4 flex-1 overflow-auto bg-white">
          <div className="p-4">
            <h2 className="text-2xl font-semibold">{meetingDetail.title}</h2>
            <p className="text-gray-500">
              멤버 {meetingDetail.participants} / {meetingDetail.maxParticipants} 명
            </p>
          </div>

          {/* information이 있을 때만 섹션 표시 */}
          {meetingDetail.information && (
            <div className="p-4">
              <div className="relative">
                <p className={`text-gray-700 ${!isExpanded && 'line-clamp-3'}`}>{meetingDetail.information}</p>
                {meetingDetail.information.length > 100 && (
                  <button onClick={() => setIsExpanded(!isExpanded)} className="text-deep-coral text-sm mt-2">
                    {isExpanded ? '접기' : '더보기'}
                  </button>
                )}
              </div>
              {/* hashtags가 있을 때만 표시 */}
              {hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {hashtags.map((tag, index) => (
                    <span key={index} className="text-xs text-deep-coral bg-orange-100 px-2 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center mb-2">
              <FaCalendarAlt className="text-gray-500 mr-2" />
              <span className="font-medium">날짜</span>
              <span className="ml-auto text-gray-600">{meetingDate}</span>
            </div>
            <div className="flex items-center mb-2">
              <FaClock className="text-gray-500 mr-2" />
              <span className="font-medium">시간</span>
              <span className="ml-auto text-gray-600">{meetingTime}</span>
            </div>
            {/* detailLocation이 있을 때만 표시 */}
            {meetingDetail.detailLocation && (
              <div className="flex items-start">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="text-gray-500 mr-2" />
                  <span className="font-medium">상세 장소</span>
                </div>
                <span className="ml-auto text-gray-600 text-right max-w-[200px] break-words">
                  {meetingDetail.detailLocation}
                </span>
              </div>
            )}
          </div>

          {/* 참여 강아지 섹션 */}
          {dogImages.length > 0 && (
            <div className="border-t border-gray-200 pt-4 flex-1 overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-center font-semibold mb-5">
                <h3>
                  참여 강아지 <span className="text-deep-coral">{dogImages.length}</span>
                </h3>
                <button onClick={detailClick} className="text-sm text-gray-700">
                  상세보기
                </button>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {dogImages.map((dogImage, index) => (
                  // unique한 dogId와 index를 조합하여 key 생성
                  <div key={`dog-${dogImage.dogId}-${index}`} className="aspect-square">
                    <img
                      src={dogImage.profileImage}
                      alt={`참여 강아지 ${index + 1}`}
                      className="w-full h-full object-cover rounded-full border border-light-orange"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/icons/favicon/favicon-96x96.png';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className={`p-2 ${meetingDetail.isParticipate ? 'bg-gray-300' : 'bg-deep-coral'}`}>
          <button
            className="w-full text-white py-2 rounded-lg font-bold"
            onClick={meetingDetail.isParticipate ? undefined : handleJoinClick}
            disabled={meetingDetail.isParticipate}
          >
            {meetingDetail.isParticipate ? '이미 가입중인 모임입니다' : '모임 가입'}
          </button>
        </div>
        <JoinConfirmationModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          onConfirm={handleConfirmJoin} // 성공 시에만 호출됨
          meetingData={meetingDetail}
          selectedDogs={selectedDogs}
          onDogSelect={handleDogSelect}
          meetingId={roomId!}
        />
        <JoinSuccessModal isOpen={showSuccessModal} onClose={handleCancelSuccess} onConfirm={handleGoToChat} />
      </motion.div>
    </motion.div>
  );
};

export default ParticipateDogPage;
