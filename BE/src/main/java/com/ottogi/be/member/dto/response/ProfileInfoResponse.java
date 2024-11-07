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
public class ProfileInfoResponse {
    private String profileImage;
    private String nickname;
    private String name;
    private Gender gender;
    private int age;

    public static ProfileInfoResponse toDto(Member member, int age) {
        return ProfileInfoResponse.builder()
                .profileImage(member.getProfileImage())
                .nickname(member.getNickname())
                .name(member.getName())
                .gender(member.getGender())
                .age(age)
                .build();
    }
}
