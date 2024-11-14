package com.ottogi.be.walking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalkingLogDto {
    private Long walkingLogId;
    private LocalDateTime date;
    private String dogImage;
    private String dogName;
    private Integer time;
    private Double distance;
}
