package com.ottogi.be.chat.dto.response;

import com.ottogi.be.chat.domain.ChatMessage;
import com.ottogi.be.chat.dto.PersonalChatInfoDto;
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

    public static ChatRoomResponse of(PersonalChatInfoDto dto, ChatMessage lastMessage, long unreadMessageCnt) {
        return ChatRoomResponse.builder()
                .chatRoomId(dto.getChatRoomId())
                .interlocutorNickname(dto.getInterlocutorNickname())
                .interlocutorProfileImage(dto.getInterlocutorProfileImage())
                .lastMessage(lastMessage.getMessage())
                .lastMessageSentAt(lastMessage.getSentAt())
                .unreadMessageCnt(unreadMessageCnt)
                .build();
    }
}
