package com.ottogi.be.meeting.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FindMeetingDto {
    private Long meetingId;
    private String loginId;
}
