package com.ottogi.be.meeting.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MeetingMemberCountDto {
    private Long meetingId;
    private Long count;
}
