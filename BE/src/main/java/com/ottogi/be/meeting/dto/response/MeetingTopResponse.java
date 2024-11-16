package com.ottogi.be.meeting.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class MeetingTopResponse {
    private String spotName;
    private List<MeetingResponse> meetings;
}
