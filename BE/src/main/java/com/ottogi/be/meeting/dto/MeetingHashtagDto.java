package com.ottogi.be.meeting.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MeetingHashtagDto {
    private Long meetingId;
    private String hashtag;
}
