package com.ottogi.be.chat.dto;

import com.ottogi.be.chat.domain.ChatRoom;
import com.ottogi.be.member.domain.Member;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class JoinMeetingChatRoomDto {
    private Member member;
    private ChatRoom chatRoom;
}
