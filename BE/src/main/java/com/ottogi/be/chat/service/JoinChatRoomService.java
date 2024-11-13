package com.ottogi.be.chat.service;

import com.ottogi.be.chat.domain.ChatMember;
import com.ottogi.be.chat.dto.JoinMeetingChatRoomDto;
import com.ottogi.be.chat.event.EnterMeetingChatRoomEvent;
import com.ottogi.be.chat.repository.ChatMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class JoinChatRoomService {

    private final ChatMemberRepository chatMemberRepository;
    private final ApplicationEventPublisher eventPublisher;

    @Transactional
    public void joinMeetingChatRoom(JoinMeetingChatRoomDto dto) {
        ChatMember chatMember = ChatMember.builder()
                .chatRoom(dto.getChatRoom())
                .member(dto.getMember())
                .build();

        chatMemberRepository.save(chatMember);

        eventPublisher.publishEvent(new EnterMeetingChatRoomEvent(dto.getChatRoom().getId(), dto.getMember().getNickname()));
    }
}
