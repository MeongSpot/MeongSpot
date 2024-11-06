package com.ottogi.be.walking.service;

import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.repository.MemberRepository;
import com.ottogi.be.walking.dto.WalkingStartDto;
import com.ottogi.be.walking.repository.WalkingRedisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ottogi.be.member.exception.MemberNotFoundException;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class WalkingStartService {
    private final MemberRepository memberRepository;
    private final WalkingRedisRepository walkingRedisRepository;

    @Transactional
    public void startWalking(WalkingStartDto dto) {
        Member member = memberRepository.findByLoginId(dto.getLoginId()).orElseThrow(MemberNotFoundException::new);

        Long startTime = Instant.now().getEpochSecond();

        walkingRedisRepository.saveStartTime(member.getId(), startTime);
        walkingRedisRepository.saveDogIds(member.getId(), dto.getDogIds());

    }
}
