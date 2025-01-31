package com.ottogi.be.dog.dto.response;

import com.ottogi.be.dog.domain.enums.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class FindMeetingDogResponse {
    private String profileImage;
    private String name;
    private String breed;
    private LocalDate birth;
    private int age;
    private Size size;
    private List<String> personality;
}
