package com.ottogi.be.dog.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FindDogProfileImage {
    private Long dogId;
    private String profileImage;
}
