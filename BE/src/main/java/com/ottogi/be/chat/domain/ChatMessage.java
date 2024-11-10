package com.ottogi.be.chat.domain;

import com.ottogi.be.chat.domain.enums.MessageType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "message")
@Getter
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
