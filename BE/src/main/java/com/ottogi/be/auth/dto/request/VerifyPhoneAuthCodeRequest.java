package com.ottogi.be.auth.dto.request;

import com.ottogi.be.member.validation.annotation.Phone;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class VerifyPhoneAuthCodeRequest {
    private String phone;
    @NotNull
    private String authCode;
}
