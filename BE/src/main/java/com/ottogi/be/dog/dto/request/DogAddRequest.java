package com.ottogi.be.dog.dto.request;

import com.ottogi.be.dog.domain.enums.Gender;
import com.ottogi.be.dog.domain.enums.Size;
import com.ottogi.be.dog.dto.DogAddDto;
import com.ottogi.be.dog.validation.annotation.Name;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class DogAddRequest {
    private MultipartFile profileImage;
    @Name
    private String name;
    private String breed;
    private Size size;
    @Min(value = 0)
    private int age;
    private Gender gender;
    private Boolean isNeuter;
    private LocalDate birth;
    private String introduction;
    private List<Long> personality;

    public DogAddDto toDto(String loginId) {
        return DogAddDto.builder()
                .loginId(loginId)
                .profileImage(profileImage)
                .name(name)
                .breed(breed)
                .size(size)
                .age(age)
                .gender(gender)
                .isNeuter(isNeuter)
                .birth(birth)
                .introduction(introduction)
                .personality(personality)
                .build();
    }
}
