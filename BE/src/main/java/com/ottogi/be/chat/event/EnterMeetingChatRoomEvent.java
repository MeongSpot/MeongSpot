package com.ottogi.be.chat.event;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class EnterMeetingChatRoomEvent {
    private final Long chatRoomId;
    private final String nickname;
}
