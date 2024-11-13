package com.ottogi.be.chat.service;

import com.ottogi.be.chat.domain.ChatMember;
import com.ottogi.be.chat.domain.ChatMessage;
import com.ottogi.be.chat.dto.ChatMessageDto;
import com.ottogi.be.chat.dto.FindChatRoomDto;
import com.ottogi.be.chat.dto.PersonalChatInfoDto;
import com.ottogi.be.chat.dto.response.FindChatRoomResponse;
import com.ottogi.be.chat.dto.response.ChatRoomResponse;
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
    public List<ChatRoomResponse> findChatRoomList(String loginId) {

        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(MemberNotFoundException::new);

        List<PersonalChatInfoDto> personalChatInfoList = chatMemberRepository.findAllPersonalChatRoomByMemberId(member.getId());

        List<ChatRoomResponse> result= new ArrayList<>();

        for (PersonalChatInfoDto dto : personalChatInfoList) {
            ChatMessage lastMessage = chatMessageRepository.findFirstByChatRoomIdOrderBySentAtDesc(dto.getChatRoomId());
            long unreadMessageCnt = countUnreadMessage(dto.getChatRoomId(), dto.getReadAt());

            if (lastMessage != null && (dto.getLeftAt() == null || lastMessage.getSentAt().isAfter(dto.getLeftAt()))) {
                result.add(ChatRoomResponse.of(dto, lastMessage, unreadMessageCnt));
            }
        }
        result.sort(Comparator.comparing(ChatRoomResponse::getLastMessageSentAt).reversed());
        return result;
    }

    @Transactional
    public FindChatRoomResponse findChatRoom(FindChatRoomDto dto, Pageable pageable) {

        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        ChatMember chatMember = chatMemberRepository.findByChatRoomIdAndMyId(dto.getChatRoomId(), member.getId())
                .orElseThrow(ChatRoomNotFoundException::new);

        chatMember.updateReadAt();

        LocalDateTime leftAt = chatMember.getLeftAt();

        List<ChatMessage> chatMessages = chatMessageRepository.findAllByChatRoomIdOrderBySentAtDesc(dto.getChatRoomId(), pageable);

        List<Long> senderIds = chatMessages.stream()
                .map(ChatMessage::getSenderId).distinct().collect(Collectors.toList());

        Map<Long, Member> membersMap = memberRepository.findAllById(senderIds).stream()
                .collect(Collectors.toMap(Member::getId, Function.identity()));

        List<ChatMessageDto> chatMessageDtoList = chatMessages.stream()
                .filter(chatMessage -> leftAt == null || chatMessage.getSentAt().isAfter(leftAt))
                .map(chatMessage -> {
                    Member sender = membersMap.get(chatMessage.getSenderId());
                    return ChatMessageDto.of(sender, chatMessage);
                })
                .sorted(Comparator.comparing(ChatMessageDto::getSentAt))
                .toList();

        boolean hasNext = chatMessageDtoList.size() == pageable.getPageSize();

        return new FindChatRoomResponse(member.getId(), member.getNickname(), member.getProfileImage(), new SliceImpl<>(chatMessageDtoList, pageable, hasNext));
    }

    private long countUnreadMessage(Long chatRoomId, LocalDateTime readAt) {
        if (readAt != null) {
            return chatMessageRepository.countByChatRoomIdAndSentAtAfter(chatRoomId, readAt);
        } else {
            return chatMessageRepository.countByChatRoomId(chatRoomId);
        }
    }
}
