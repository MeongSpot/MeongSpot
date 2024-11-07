package com.ottogi.be.member.service;

import com.ottogi.be.friend.repository.FriendRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.dto.MemberDetailsDto;
import com.ottogi.be.member.dto.response.MemberDetailsResponse;
import com.ottogi.be.member.dto.response.ProfileInfoResponse;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class FindMemberInfoService {

    private final MemberRepository memberRepository;
    private final FriendRepository friendRepository;

    @Transactional(readOnly = true)
    public ProfileInfoResponse getProfileInfo(String loginId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(MemberNotFoundException::new);
        LocalDate currentDate = LocalDate.now();
        int age = currentDate.getYear() - member.getBirth().getYear();
        return ProfileInfoResponse.toDto(member, age);
    }

    @Transactional(readOnly = true)
    public MemberDetailsResponse findMemberDetails(MemberDetailsDto memberDetailsDto) {
        Member me = memberRepository.findByLoginId(memberDetailsDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);
        Member findMember = memberRepository.findById(memberDetailsDto.getId())
                .orElseThrow(MemberNotFoundException::new);
        boolean isFriend = friendRepository.isFriend(me.getId(), findMember.getId());
        LocalDateTime currentDate = LocalDateTime.now();
        int age = currentDate.getYear() - findMember.getBirth().getYear();
        return MemberDetailsResponse.toDto(findMember, isFriend, age);
    }
}
