package com.ottogi.be.walking.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class WalkingEndRequest {
    private double distance;
    private LocalDateTime finishedAt;
}
