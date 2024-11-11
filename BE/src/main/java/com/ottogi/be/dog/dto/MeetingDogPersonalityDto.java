package com.ottogi.be.dog.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class MeetingDogPersonalityDto {
    private Long dogId;
    private String personality;
}
