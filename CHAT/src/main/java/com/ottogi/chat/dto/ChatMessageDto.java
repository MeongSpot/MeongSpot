package com.ottogi.chat.dto;

import com.ottogi.chat.domain.enums.MessageType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessageDto {
    private Long senderId;
    private String message;
    private String nickname;
    private String profileImage;
    private LocalDateTime sentAt;
    private MessageType messageType;
}
