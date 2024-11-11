package com.ottogi.be.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ReadMessageDto {
    private String loginId;
    private Long chatRoomId;
}
