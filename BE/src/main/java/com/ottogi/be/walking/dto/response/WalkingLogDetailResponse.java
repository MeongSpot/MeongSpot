package com.ottogi.be.walking.dto.response;

import com.ottogi.be.walking.dto.PointDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class WalkingLogDetailResponse {
    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;
    private String dogImage;
    private String dogName;
    private Integer time;
    private Double distance;
    private List<PointDto> trail;
}
