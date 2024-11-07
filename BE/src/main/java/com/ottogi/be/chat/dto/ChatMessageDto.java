package com.ottogi.be.chat.dto;

import com.ottogi.be.chat.domain.ChatMessage;
import com.ottogi.be.chat.domain.enums.MessageType;
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
}
