package com.ottogi.chat.service;

import com.ottogi.chat.domain.Member;
import com.ottogi.chat.dto.ChatMessageDto;
import com.ottogi.chat.dto.request.SendMessageRequest;
import com.ottogi.chat.exception.MemberNotFoundException;
import com.ottogi.chat.repository.ChatMessageRepository;
import com.ottogi.chat.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SendMessageService {

    private final MemberRepository memberRepository;
    private final ChatMessageRepository chatMessageRepository;

    @Transactional(readOnly = true)
    public ChatMessageDto sendMessage(SendMessageRequest request, Long chatRoomId) {
        Member member = memberRepository.findById(request.getSenderId())
                .orElseThrow(MemberNotFoundException::new);

        chatMessageRepository.save(request.toEntity(chatRoomId));

        return ChatMessageDto.builder()
                .message(request.getMessage())
                .messageType(request.getMessageType())
                .nickname(member.getNickname())
                .profileImage(member.getProfileImage())
                .senderId(member.getId())
                .sentAt(LocalDateTime.now())
                .build();
    }
}
