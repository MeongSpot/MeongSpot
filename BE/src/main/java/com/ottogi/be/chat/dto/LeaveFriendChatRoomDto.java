package com.ottogi.be.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LeaveFriendChatRoomDto {
    private String loginId;
    private Long chatRoomId;
}
