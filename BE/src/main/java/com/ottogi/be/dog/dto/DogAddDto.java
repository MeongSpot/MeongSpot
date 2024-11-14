package com.ottogi.be.dog.dto;

import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.dog.domain.enums.Gender;
import com.ottogi.be.dog.domain.enums.Size;
import com.ottogi.be.member.domain.Member;
import lombok.Builder;
import lombok.Getter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Builder
@Getter
public class DogAddDto {
    private MultipartFile profileImage;
    private String name;
    private String breed;
    private Size size;
    private int age;
    private Gender gender;
    private Boolean isNeuter;
    private LocalDate birth;
    private String introduction;
    private List<Long> personality;
    private String loginId;

    public Dog toEntity(String imagePath, Member member) {
        return Dog.builder()
                .member(member)
                .profileImage(imagePath)
                .name(name)
                .breed(breed)
                .size(size)
                .age(age)
                .gender(gender)
                .isNeuter(isNeuter)
                .birth(birth)
                .introduction(introduction)
                .build();
    }
}
