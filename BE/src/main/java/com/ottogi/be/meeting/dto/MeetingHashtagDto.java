package com.ottogi.be.meeting.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MeetingHashtagDto {
    private Long meetingId;
    private String hashtag;
}
