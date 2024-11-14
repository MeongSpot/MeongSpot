package com.ottogi.be.meeting.dto.response;

import com.ottogi.be.meeting.domain.Meeting;
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
    private String information;

    public static FindMeetingResponse from(Meeting meeting) {
        return FindMeetingResponse.builder()
                .title(meeting.getTitle())
                .participants(meeting.getParticipants())
                .maxParticipants(meeting.getMaxParticipants())
                .meetingAt(meeting.getMeetingAt())
                .detailLocation(meeting.getDetailLocation())
                .information(meeting.getInformation())
                .build();
    }
}
