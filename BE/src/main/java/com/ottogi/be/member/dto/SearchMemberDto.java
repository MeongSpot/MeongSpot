package com.ottogi.be.member.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SearchMemberDto {
    private String loginId;
    private String targetNickname;
}
