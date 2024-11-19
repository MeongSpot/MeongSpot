package com.ottogi.be.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LeaveMeetingChatRoomDto {
    private Long chatRoomId;
    private Long memberId;
    private String nickname;
}
