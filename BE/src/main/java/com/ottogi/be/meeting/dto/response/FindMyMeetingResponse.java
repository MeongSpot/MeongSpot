package com.ottogi.be.meeting.dto.response;

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
    private List<String> hashtag;
    private Long chatRoomId;
    private long unreadMessageCnt;
}
