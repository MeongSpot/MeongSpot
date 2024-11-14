package com.ottogi.be.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class PersonalChatInfoDto {
    private Long chatRoomId;
    private String interlocutorNickname;
    private String interlocutorProfileImage;
    private LocalDateTime readAt;
    private LocalDateTime leftAt;
}
