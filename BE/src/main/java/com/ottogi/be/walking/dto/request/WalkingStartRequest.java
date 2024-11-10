package com.ottogi.be.walking.dto.request;

import com.ottogi.be.walking.dto.WalkingStartDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class WalkingStartRequest {
    private List<Long> dogIds;

    public WalkingStartDto toDto(String loginId){
        return WalkingStartDto.builder()
                .dogIds(this.dogIds)
                .loginId(loginId)
                .build();
    }

}