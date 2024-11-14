package com.ottogi.be.walking.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class WalkingEndDto {
    private Long memberId;
    private Long dogId;
    private LocalDateTime startedAt;
    private LocalDateTime finishedAt;
    private double distance;
    private String trail;
}
