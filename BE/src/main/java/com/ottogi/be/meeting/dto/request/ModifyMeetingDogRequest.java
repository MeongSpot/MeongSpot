package com.ottogi.be.meeting.dto.request;

import com.ottogi.be.meeting.dto.ModifyMeetingDogDto;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ModifyMeetingDogRequest {
    private Long meetingId;
    @NotEmpty
    @Size(min = 1)
    private List<Long> dogIds;

    public ModifyMeetingDogDto toDto(String loginId) {
        return ModifyMeetingDogDto.builder()
                .loginId(loginId)
                .meetingId(meetingId)
                .dogIds(dogIds)
                .build();
    }
}
