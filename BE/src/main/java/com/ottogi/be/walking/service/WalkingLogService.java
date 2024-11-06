package com.ottogi.be.walking.service;

import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import com.ottogi.be.walking.dto.MonthlyWalkingLogDto;
import com.ottogi.be.walking.dto.WalkingLogDto;
import com.ottogi.be.walking.dto.response.WalkingLogResponse;
import com.ottogi.be.walking.repository.WalkingLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WalkingLogService {

    private final MemberRepository memberRepository;
    private final WalkingLogRepository walkingLogRepository;

    @Transactional(readOnly = true)
    public WalkingLogResponse findWalkingLog(String loginId){
        Member member = memberRepository.findByLoginId(loginId).orElseThrow(MemberNotFoundException::new);
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();

        List<MonthlyWalkingLogDto> monthlyLogs = walkingLogRepository.findMonthlyStatsForMember(member.getId(), startOfMonth);
        List<WalkingLogDto> recentWalks = walkingLogRepository.findRecentWalksForMember(member.getId());

        return new WalkingLogResponse(monthlyLogs, recentWalks);

    }

}
