package com.ottogi.be.dog.dto.response;

import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.dog.domain.enums.Gender;
import com.ottogi.be.dog.domain.enums.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class FindDogResponse {
    private Long id;
    private String name;
    private LocalDate birth;
    private String introduction;
    private Gender gender;
    private Size size;
    private Boolean isNeuter;
    private String profileImage;
    private int age;
    private String breed;
    private List<String> personality;

    public static FindDogResponse of(Dog dog,List<String> personality) {
        return FindDogResponse.builder()
                .id(dog.getId())
                .name(dog.getName())
                .birth(dog.getBirth())
                .introduction(dog.getIntroduction())
                .gender(dog.getGender())
                .size(dog.getSize())
                .isNeuter(dog.getIsNeuter())
                .profileImage(dog.getProfileImage())
                .age(dog.getAge())
                .breed(dog.getBreed())
                .personality(personality)
                .build();
    }
}
