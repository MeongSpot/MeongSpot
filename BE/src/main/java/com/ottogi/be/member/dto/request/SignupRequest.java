package com.ottogi.be.member.dto.request;

import com.ottogi.be.member.domain.enums.Gender;
import com.ottogi.be.member.validation.annotation.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    @LoginId
    private String loginId;
    @Password
    private String password;
    @Name
    private String name;
    @Nickname
    private String nickname;
    private LocalDate birth;
    @Phone
    private String phone;
    private Gender gender;
}
