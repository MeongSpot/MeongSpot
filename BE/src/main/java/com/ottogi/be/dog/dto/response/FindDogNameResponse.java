package com.ottogi.be.dog.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FindDogNameResponse {
    private Long id;
    private String name;
}
