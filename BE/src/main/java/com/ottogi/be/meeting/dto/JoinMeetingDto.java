package com.ottogi.be.meeting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class JoinMeetingDto {
    private Long meetingId;
    private List<Long> dogIds;
    private String loginId;
}
