package com.ottogi.be.chat.dto;

import com.ottogi.be.chat.domain.ChatMessage;
import com.ottogi.be.chat.domain.enums.MessageType;
import com.ottogi.be.member.domain.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessageDto {
    private Long senderId;
    private String message;
    private String nickname;
    private String profileImage;
    private LocalDateTime sentAt;
    private MessageType messageType;

    public static ChatMessageDto of(Member sender, ChatMessage message) {
        return ChatMessageDto.builder()
                .senderId(message.getSenderId())
                .message(message.getMessage())
                .nickname(sender.getNickname())
                .profileImage(sender.getProfileImage())
                .sentAt(message.getSentAt())
                .messageType(message.getMessageType())
                .build();
    }
}
