package com.ottogi.be.member.dto.response;

import com.ottogi.be.member.domain.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class FindMeetingMemberResponse {
    private Long memberId;
    private String profileImage;
    private String nickname;
    private LocalDate birth;
    private Gender gender;
}
