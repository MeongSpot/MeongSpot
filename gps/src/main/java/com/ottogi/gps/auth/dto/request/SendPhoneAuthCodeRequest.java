package com.ottogi.gps.auth.dto.request;

import com.ottogi.gps.member.validation.annotation.Phone;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class SendPhoneAuthCodeRequest {
    @Phone
    private String phone;
}
