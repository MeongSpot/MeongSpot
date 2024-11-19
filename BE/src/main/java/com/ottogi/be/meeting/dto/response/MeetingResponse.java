package com.ottogi.be.meeting.dto.response;

import com.ottogi.be.meeting.domain.Meeting;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class MeetingResponse {
    private Long meetingId;
    private String title;
    private int participants;
    private int maxParticipants;
    private LocalDateTime meetingAt;
    private String detailLocation;
    private List<String> hashtags;

    public static MeetingResponse of(Meeting meeting, List<String> hashtags) {
        return MeetingResponse.builder()
                .meetingId(meeting.getId())
                .title(meeting.getTitle())
                .participants(meeting.getParticipants())
                .maxParticipants(meeting.getMaxParticipants())
                .meetingAt(meeting.getMeetingAt())
                .detailLocation(meeting.getDetailLocation())
                .hashtags(hashtags)
                .build();
    }
}
