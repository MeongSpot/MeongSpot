package com.ottogi.be.meeting.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class ModifyMeetingDogDto {
    private String loginId;
    private Long meetingId;
    private List<Long> dogIds;
}
