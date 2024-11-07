package com.ottogi.be.friend.dto.response;

import com.ottogi.be.member.domain.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FriendDetailsResponse {
    private String profileImage;
    private String nickname;
    private Gender gender;
    private int age;
}
