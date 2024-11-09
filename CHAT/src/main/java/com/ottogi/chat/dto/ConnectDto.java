package com.ottogi.chat.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ConnectDto {
    private Long chatRoomId;
    private Long memberId;
}
