package com.ottogi.be.notification.dto.request;

import com.ottogi.be.notification.dto.FCMTokenDto;
import lombok.*;

@Getter
@Builder
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FCMTokenRequest {
    private String token;

    public FCMTokenDto toDto(String loginId){
        return FCMTokenDto.builder()
                .token(this.token)
                .loginId(loginId)
                .build();
    }

}
