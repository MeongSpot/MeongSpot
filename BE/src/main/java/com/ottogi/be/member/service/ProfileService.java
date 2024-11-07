package com.ottogi.be.member.service;

import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.dto.response.ProfileInfoResponse;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final MemberRepository memberRepository;

    public ProfileInfoResponse getProfileInfo(String loginId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(MemberNotFoundException::new);
        LocalDate currentDate = LocalDate.now();
        int age = currentDate.getYear() - member.getBirth().getYear();
        return ProfileInfoResponse.toDto(member, age);
    }
}
