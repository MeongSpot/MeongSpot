package com.ottogi.be.dog.dto.response;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class PersonalityResponse {
    private Long id;
    private String name;
}
