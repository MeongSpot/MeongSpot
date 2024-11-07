package com.ottogi.be.member.dto.response;

import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.domain.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberDetailsResponse {
    private Long id;
    private String profileImage;
    private String nickname;
    private Gender gender;
    private int age;
    private Boolean isFriend;

    public static MemberDetailsResponse toDto(Member member, boolean isFriend, int age) {
        return MemberDetailsResponse.builder()
                .id(member.getId())
                .profileImage(member.getProfileImage())
                .nickname(member.getNickname())
                .gender(member.getGender())
                .age(age)
                .isFriend(isFriend)
                .build();
    }
}
