package com.ottogi.be.dog.dto.response;

import com.ottogi.be.dog.domain.enums.Gender;
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
public class FindDogResponse {
    private Long id;
    private String name;
    private LocalDate birth;
    private String introduction;
    private Gender gender;
    private Boolean isNeuter;
    private String profileImage;
    private int age;
    private String breed;
    private List<String> personality;
}
