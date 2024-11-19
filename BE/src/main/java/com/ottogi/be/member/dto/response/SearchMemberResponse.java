package com.ottogi.be.member.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SearchMemberResponse {
    private Long id;
    private String nickname;
    private String profileImage;

    private List<String> dogNameList;
}
