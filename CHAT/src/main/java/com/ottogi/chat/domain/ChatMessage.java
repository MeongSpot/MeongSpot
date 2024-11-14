package com.ottogi.chat.domain;

import com.ottogi.chat.domain.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "message")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    @Id
    private String id;
    private Long chatRoomId;
    private String message;
    private Long senderId;
    private LocalDateTime sentAt;
    private MessageType messageType;
}