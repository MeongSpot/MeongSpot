package com.ottogi.be.meeting.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class DeleteMeetingDto {
    private Long meetingId;
    private Long chatRoomId;
}
