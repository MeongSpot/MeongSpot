package com.ottogi.be.meeting.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeetingTopResponse {
    private String spotName;
    private List<MeetingResponse> meetings;
}
