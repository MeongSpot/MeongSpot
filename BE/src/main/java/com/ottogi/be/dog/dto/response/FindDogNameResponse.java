package com.ottogi.be.dog.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class FindDogNameResponse {
    private Long id;
    private String name;
}
