package com.ottogi.be.dog.service;

import com.ottogi.be.dog.dto.response.FindDogNameResponse;
import com.ottogi.be.dog.repository.DogRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FindDogListService {

    private final DogRepository dogRepository;
    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public List<FindDogNameResponse> findDogNameList(String loginId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(MemberNotFoundException::new);
        return dogRepository.findDogNameByMember(member);
    }
}
