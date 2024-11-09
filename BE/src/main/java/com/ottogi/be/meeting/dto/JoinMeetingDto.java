package com.ottogi.be.meeting.dto;

import com.ottogi.be.meeting.dto.request.JoinMeetingRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JoinMeetingDto {
    private Long meetingId;
    private List<Long> dogIds;
    private String loginId;

    public static JoinMeetingDto toDto(Long meetingId, JoinMeetingRequest joinMeetingRequest, String loginId) {
        return JoinMeetingDto.builder()
                .meetingId(meetingId)
                .dogIds(joinMeetingRequest.getDogIds())
                .loginId(loginId)
                .build();
    }
}
