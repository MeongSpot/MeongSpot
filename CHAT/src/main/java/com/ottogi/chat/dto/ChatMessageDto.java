package com.ottogi.chat.dto;

import com.ottogi.chat.domain.ChatMessage;
import com.ottogi.chat.domain.enums.MessageType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto {
    private Long chatRoomId;
    private Long senderId;
    private String message;
    private String nickname;
    private String profileImage;
    private MessageType messageType;
    private LocalDateTime sentAt;

    public ChatMessage toEntity() {
        return ChatMessage.builder()
                .chatRoomId(chatRoomId)
                .messageType(messageType)
                .message(message)
                .senderId(senderId)
                .sentAt(sentAt)
                .build();
    }
}
