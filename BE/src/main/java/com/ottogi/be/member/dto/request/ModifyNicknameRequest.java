package com.ottogi.be.member.dto.request;

import com.ottogi.be.member.dto.ModifyNicknameDto;
import com.ottogi.be.member.validation.annotation.Nickname;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ModifyNicknameRequest {
    @Nickname
    private String nickname;

    public ModifyNicknameDto toDto(String loginId) {
        return ModifyNicknameDto.builder()
                .nickname(nickname)
                .loginId(loginId)
                .build();
    }
}
