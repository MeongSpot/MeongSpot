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
public class FindMyMeetingResponse {
    private Long meetingId;
    private String title;
    private int participants;
    private int maxParticipants;
    private LocalDateTime meetingAt;
    private String spotName;
    private List<String> hashtags;
    private Long chatRoomId;
    private long unreadMessageCnt;

    public static FindMyMeetingResponse of(Meeting meeting, List<String> hashtags, long unreadMessageCnt) {
        return FindMyMeetingResponse.builder()
                .meetingId(meeting.getId())
                .title(meeting.getTitle())
                .maxParticipants(meeting.getMaxParticipants())
                .meetingAt(meeting.getMeetingAt())
                .unreadMessageCnt(unreadMessageCnt)
                .chatRoomId(meeting.getChatRoom().getId())
                .hashtags(hashtags)
                .spotName(meeting.getSpot().getName())
                .participants(meeting.getParticipants())
                .build();
    }
}
