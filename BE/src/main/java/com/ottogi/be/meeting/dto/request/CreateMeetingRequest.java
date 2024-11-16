package com.ottogi.be.meeting.dto.request;

import com.ottogi.be.meeting.dto.CreateMeetingDto;
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
    @NotNull
    private Long spotId;
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
    private List<String> hashtags;
    @NotNull
    @Min(value = 2)
    @Max(value = 10)
    private Integer maxParticipants;
    @NotEmpty
    @Size(min = 1)
    private List<Long> dogIds;
    private String information;

    public CreateMeetingDto toDto(String loginId) {
        return CreateMeetingDto.builder()
                .spotId(spotId)
                .loginId(loginId)
                .title(title)
                .date(date)
                .hour(hour)
                .minute(minute)
                .detailLocation(detailLocation)
                .hashtags(hashtags)
                .maxParticipants(maxParticipants)
                .dogIds(dogIds)
                .information(information)
                .build();
    }
}
