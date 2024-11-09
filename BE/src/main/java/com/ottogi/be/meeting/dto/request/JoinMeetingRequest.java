package com.ottogi.be.meeting.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class JoinMeetingRequest {
    @NotEmpty
    @Size(min = 1)
    List<Long> dogIds;
}
