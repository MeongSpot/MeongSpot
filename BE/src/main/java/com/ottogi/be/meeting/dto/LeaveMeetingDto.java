package com.ottogi.be.meeting.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LeaveMeetingDto {
    private Long meetingId;
    private String loginId;
}
