package com.ottogi.be.walking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyWalkingLogDto {
    private String dogImage;
    private String dogName;
    private Long monthlyWalkCount;
    private Long monthlyWalkTime;
    private Double monthlyWalkDistance;
}
