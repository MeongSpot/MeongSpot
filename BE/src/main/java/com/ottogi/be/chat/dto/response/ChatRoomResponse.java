package com.ottogi.be.chat.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomResponse {
    private Long chatRoomId;
    private String interlocutorNickname;
    private String interlocutorProfileImage;
    private String lastMessage;
    private LocalDateTime lastMessageSentAt;
    private Long unreadMessageCnt;
}
