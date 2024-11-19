package com.ottogi.be.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePersonalChatRoomDto {
    private Long interlocutorId;
    private String loginId;
}
