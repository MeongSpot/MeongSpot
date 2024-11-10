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
public class FriendChatRoomResponse {
    private Long chatRoomId;
    private String friend;
    private String friendProfileImage;
    private String lastMessage;
    private LocalDateTime lastMessageSentAt;
}
