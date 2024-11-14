package com.ottogi.be.walking.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalkingStartDto {
    private List<Long> dogIds;
    private String loginId;
}
