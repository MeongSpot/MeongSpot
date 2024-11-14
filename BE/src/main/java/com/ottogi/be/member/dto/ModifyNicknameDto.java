package com.ottogi.be.member.dto;

import lombok.*;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ModifyNicknameDto {
    private String nickname;
    private String loginId;
}
