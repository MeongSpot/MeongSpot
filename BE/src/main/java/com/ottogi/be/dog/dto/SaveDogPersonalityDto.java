package com.ottogi.be.dog.dto;

import com.ottogi.be.dog.domain.Dog;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class SaveDogPersonalityDto {
    private Dog dog;
    private List<Long> personalityIdList;
}
