package com.ottogi.be.member.service;

import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.dto.SearchMemberDto;
import com.ottogi.be.member.dto.response.SearchMemberResponse;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchMemberService {

    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public List<SearchMemberResponse> searchMember(SearchMemberDto dto) {
        Member me = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        List<Member> memberList = memberRepository.searchByNickname(dto.getTargetNickname(), me.getId());

        List<SearchMemberResponse> result = new ArrayList<>();
        for (Member member : memberList) {

            List<Dog> dogList = member.getDogList();
            List<String> dogNames = (dogList.isEmpty()) ?
                    Collections.emptyList() :
                    dogList.stream()
                            .map(Dog::getName)
                            .toList();

            SearchMemberResponse response = SearchMemberResponse.builder()
                    .id(member.getId())
                    .nickname(member.getNickname())
                    .profileImage(member.getProfileImage())
                    .dogNameList(dogNames)
                    .build();

            result.add(response);
        }

        return result;
    }
}
