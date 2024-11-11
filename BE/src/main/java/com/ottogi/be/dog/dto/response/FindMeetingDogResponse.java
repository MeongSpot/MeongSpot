package com.ottogi.be.dog.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FindMeetingDogResponse {
    private String profileImage;
    private String name;
    private String breed;
    private LocalDate birth;
    private int age;
    private List<String> personality;
}
