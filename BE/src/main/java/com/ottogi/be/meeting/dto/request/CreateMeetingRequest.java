package com.ottogi.be.meeting.dto.request;

import com.ottogi.be.meeting.validation.annotation.Hashtag;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CreateMeetingRequest {
    @NotBlank
    private String title;
    @NotNull
    private LocalDate date;
    @NotNull
    @Min(value = 0)
    @Max(value = 23)
    private Integer hour;
    @NotNull
    @Min(value = 0)
    @Max(value = 59)
    private Integer minute;
    private String detailLocation;
    @Hashtag
    private List<String> hashtag;
    @NotNull
    @Min(value = 2)
    @Max(value = 10)
    private Integer maxParticipants;
    @NotEmpty
    @Size(min = 1)
    private List<Long> dogs;
}
