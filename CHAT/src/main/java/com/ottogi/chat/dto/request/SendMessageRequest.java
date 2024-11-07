package com.ottogi.chat.dto.request;

import com.ottogi.chat.domain.ChatMessage;
import com.ottogi.chat.domain.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SendMessageRequest {
    private String message;
    private Long senderId;
    private MessageType messageType;

    public ChatMessage toEntity(Long chatRoomId) {
        return ChatMessage.builder()
                .chatRoomId(chatRoomId)
                .messageType(messageType)
                .message(message)
                .senderId(senderId)
                .sentAt(LocalDateTime.now())
                .build();
    }
}
