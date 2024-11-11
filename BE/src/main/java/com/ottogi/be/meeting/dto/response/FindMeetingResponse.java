package com.ottogi.be.meeting.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FindMeetingResponse {
    private String title;
    private int participants;
    private int maxParticipants;
    private LocalDateTime meetingAt;
    private String detailLocation;
}
