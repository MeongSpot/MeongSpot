import React, { useState } from 'react';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import morningDog from '@/assets/chat/morningDog.png';
import lunchDog from '@/assets/chat/lunchDog.png';
import dinnerDog from '@/assets/chat/dinnerDog.png';
import ChatOptionsModal from './ChatOptionModal';

interface Message {
    message: string;
    time: string;
}

interface GroupChat {
    id: number;
    name: string;
    profileImage? : string;
    messages: Message[];
    participants: { current: number; max: number };
    walkTime: string,
}

const GroupChatList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedChat, setSelectedChat] = useState<GroupChat | null>(null);
    const navigate = useNavigate();

    const getProfileImageByWalkTime = (walkTime: string) => {
        const hour = parseInt(walkTime.split(':')[0], 10); // 시간 부분만 추출하여 정수로 변환
        if (hour >= 4 && hour < 12) {
            return morningDog;
        } else if (hour >= 12 && hour < 20) {
            return lunchDog;
        } else {
            return dinnerDog;
        }
    };

    const groupChats: GroupChat[] = [
        {
            id: 1,
            name: '아침 산책',
            messages: [{ message: '저희 강아지 너무 소심해서 걱정이에요', time: '08:25' }],
            participants: { current: 5, max: 6 },
            walkTime: '08:00'
        },
        {
            id: 2,
            name: '저녁 산책 같이해요~',
            messages: [{ message: '다음에 또 같이 산책해요~~', time: '20:25' }],
            participants: { current: 5, max: 6 },
            walkTime: '00:30'
        },
        {
            id: 3,
            name: '소심한 강아지 환영!',
            messages: [{ message: '동락공원에서 보는거 맞죠?', time: '17:35' }],
            participants: { current: 4, max: 6 },
            walkTime: '13:00'
        },
    ];

    const openModal = (chat: GroupChat) => {
        setSelectedChat(chat);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedChat(null);
    };

    const handleNavigateToChat = (chatId: number) => {
        navigate(`/chat/group/${chatId}`);
    };

    return (
        <div>
            {groupChats.map((chat) => {
                const lastMessage = chat.messages[chat.messages.length - 1];
                const profileImage = getProfileImageByWalkTime(chat.walkTime);

                return (
                    <div
                        key={chat.id}
                        className="flex items-center py-4 px-4 border-b border-gray-300 cursor-pointer"
                        onClick={() => handleNavigateToChat(chat.id)}
                    >
                        <img src={profileImage} alt={chat.name} className="w-12 h-12 rounded-full mr-4" />
                        <div className="flex-1">
                            <div className="font-bold text-lg">{chat.name}</div>
                            <div className="text-gray-600">{lastMessage?.message || 'No messages yet'}</div>
                        </div>
                        <div className="mr-4 flex flex-col items-end">
                            <div className="flex items-center text-gray-500 text-sm">
                                <AiOutlineUsergroupAdd size={16} className="mr-1" />
                                <span>{chat.participants.current} / {chat.participants.max}</span>
                            </div>
                            <div className="text-gray-400 text-xs">
                                {lastMessage?.time || ''}
                            </div>
                        </div>
                        <button
                            className="text-gray-500 z-10"
                            onClick={(e) => {
                                e.stopPropagation(); // 아이콘 클릭 시 페이지 이동 방지
                                openModal(chat);
                            }}
                        >
                            <BiDotsVerticalRounded size={24} />
                        </button>
                    </div>
                );
            })}

            <ChatOptionsModal
                isOpen={isModalOpen}
                onClose={closeModal}
                chatName={selectedChat ? selectedChat.name : ''}
            />
        </div>
    );
};

export default GroupChatList;
