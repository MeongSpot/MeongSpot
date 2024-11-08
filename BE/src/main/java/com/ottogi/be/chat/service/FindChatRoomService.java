package com.ottogi.be.chat.service;

import com.ottogi.be.chat.domain.ChatMember;
import com.ottogi.be.chat.domain.ChatMessage;
import com.ottogi.be.chat.domain.ChatRoom;
import com.ottogi.be.chat.dto.ChatMessageDto;
import com.ottogi.be.chat.dto.FindChatRoomDto;
import com.ottogi.be.chat.dto.response.FindChatRoomResponse;
import com.ottogi.be.chat.dto.response.FriendChatRoomResponse;
import com.ottogi.be.chat.exception.ChatRoomNotFoundException;
import com.ottogi.be.chat.repository.ChatMemberRepository;
import com.ottogi.be.chat.repository.ChatMessageRepository;
import com.ottogi.be.chat.repository.ChatRoomRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.SliceImpl;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FindChatRoomService {

    private final ChatMemberRepository chatMemberRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public List<FriendChatRoomResponse> findFriendChatRoomList(String loginId) {
        List<ChatMember> myFriendInfos = chatMemberRepository.findAllChatFriendByLoginId(loginId);
        List<ChatMember> myFriendChatList = chatMemberRepository.findAllFriendChatByLoginId(loginId);

        List<FriendChatRoomResponse> result= new ArrayList<>();

        for (int i = 0; i < myFriendInfos.size(); i++) {
            ChatMember chatMember = myFriendInfos.get(i);
            Long chatRoomId = chatMember.getChatRoom().getId();
            ChatMessage lastMessage = chatMessageRepository.findFirstByChatRoomIdOrderBySentAtDesc(chatRoomId);

            LocalDateTime leftAt = myFriendChatList.get(i).getLeftAt();
            LocalDateTime readAt = myFriendChatList.get(i).getReadAt();

            long unreadMessageCnt = 0;

            if (readAt != null) {
                unreadMessageCnt = chatMessageRepository.countByChatRoomIdAndSentAtAfter(chatRoomId, readAt);
            } else {
                unreadMessageCnt = chatMessageRepository.countByChatRoomId(chatRoomId);
            }


            if (lastMessage != null && (leftAt == null || lastMessage.getSentAt().isAfter(leftAt))) {
                FriendChatRoomResponse response = FriendChatRoomResponse.builder()
                        .chatRoomId(chatRoomId)
                        .friend(chatMember.getMember().getNickname())
                        .friendProfileImage(chatMember.getMember().getProfileImage())
                        .lastMessage(lastMessage.getMessage())
                        .lastMessageSentAt(lastMessage.getSentAt())
                        .unreadMessageCnt(unreadMessageCnt)
                        .build();
                result.add(response);
            }
        }
        result.sort(Comparator.comparing(FriendChatRoomResponse::getLastMessageSentAt).reversed());

       return result;
    }

    @Transactional
    public FindChatRoomResponse findChatRoom(FindChatRoomDto dto, Pageable pageable) {
        ChatRoom chatRoom = chatRoomRepository.findById(dto.getChatRoomId())
                .orElseThrow(ChatRoomNotFoundException::new);

        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        ChatMember chatMember = chatMemberRepository.findByChatRoomIdAndMyId(chatRoom.getId(), member.getId())
                .orElseThrow(ChatRoomNotFoundException::new);

        chatMember.updateReadAt();

        LocalDateTime leftAt = chatMember.getLeftAt();

        List<ChatMessage> chatMessages = chatMessageRepository.findAllByChatRoomIdOrderBySentAtDesc(chatRoom.getId(), pageable);

        List<Long> senderIds = chatMessages.stream()
                .map(ChatMessage::getSenderId)
                .distinct()
                .collect(Collectors.toList());

        Map<Long, Member> membersMap = memberRepository.findAllById(senderIds)
                .stream()
                .collect(Collectors.toMap(Member::getId, Function.identity()));


        List<ChatMessageDto> chatMessageDtoList = chatMessages.stream()
                .filter(chatMessage -> leftAt == null || chatMessage.getSentAt().isAfter(leftAt))
                .map(chatMessage -> {
                    Member sender = membersMap.get(chatMessage.getSenderId());

                    return ChatMessageDto.builder()
                            .senderId(chatMessage.getSenderId())
                            .message(chatMessage.getMessage())
                            .nickname(sender.getNickname())
                            .profileImage(sender.getProfileImage())
                            .sentAt(chatMessage.getSentAt())
                            .messageType(chatMessage.getMessageType())
                            .build();
                })
                .toList();

        boolean hasNext = chatMessageDtoList.size() == pageable.getPageSize();

        return new FindChatRoomResponse(member.getId(), member.getNickname(), member.getProfileImage(), new SliceImpl<>(chatMessageDtoList, pageable, hasNext));
    }
}
