package com.ottogi.be.walking.dto.response;

import com.ottogi.be.walking.dto.MonthlyWalkingLogDto;
import com.ottogi.be.walking.dto.WalkingLogDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalkingLogResponse {
    private List<MonthlyWalkingLogDto> monthlyWalkingLogs;
    private List<WalkingLogDto> recentWalkingLogs;
}
