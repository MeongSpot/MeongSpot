package com.ottogi.be.member.service;

import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.dto.ModifyNicknameDto;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ModifyNicknameService {

    private final MemberRepository memberRepository;
    private final CheckInfoService checkInfoService;

    @Transactional
    public void modifyNickname(ModifyNicknameDto dto) {
        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        checkInfoService.checkNickname(dto.getNickname());

        member.updateNickname(dto.getNickname());
    }
}
