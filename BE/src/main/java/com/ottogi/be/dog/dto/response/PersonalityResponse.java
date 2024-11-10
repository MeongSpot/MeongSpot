package com.ottogi.be.dog.dto.response;

import com.ottogi.be.dog.domain.Personality;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class PersonalityResponse {
    private Long id;
    private String name;

    public static PersonalityResponse from(Personality personality) {
        return PersonalityResponse.builder()
                .id(personality.getId())
                .name(personality.getName())
                .build();
    }
}
