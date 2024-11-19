package com.ottogi.be.walking.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import com.ottogi.be.walking.domain.WalkingLog;
import com.ottogi.be.walking.dto.MonthlyWalkingLogDto;
import com.ottogi.be.walking.dto.PointDto;
import com.ottogi.be.walking.dto.WalkingLogDto;
import com.ottogi.be.walking.dto.request.WalkingEndRequest;
import com.ottogi.be.walking.dto.response.WalkingLogDetailResponse;
import com.ottogi.be.walking.dto.response.WalkingLogResponse;
import com.ottogi.be.walking.exception.WalkingLogNotFoundException;
import com.ottogi.be.walking.repository.WalkingLogRepository;

import com.ottogi.be.walking.repository.WalkingRedisRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static com.ottogi.be.walking.util.PolylineUtils.decodePolyline;

@Service
@RequiredArgsConstructor
public class WalkingLogService {

    private final MemberRepository memberRepository;
    private final WalkingLogRepository walkingLogRepository;
    private final WalkingEndService walkingEndService;
    private final RedisTemplate<String, Object> redisTemplate;

    @Transactional(readOnly = true)
    public WalkingLogResponse findWalkingLog(String loginId){
        Member member = memberRepository.findByLoginId(loginId).orElseThrow(MemberNotFoundException::new);
        LocalDateTime startOfMonth = LocalDate.now().withDayOfMonth(1).atStartOfDay();

        List<MonthlyWalkingLogDto> monthlyLogs = walkingLogRepository.findMonthlyStatsForMember(member.getId(), startOfMonth);
        List<WalkingLogDto> recentWalks = walkingLogRepository.findRecentWalksForMember(member.getId());

        return new WalkingLogResponse(monthlyLogs, recentWalks);

    }

    @Transactional(readOnly = true)
    public WalkingLogDetailResponse findWalkingLogDetail(Long walkingLogId){
        WalkingLog walkingLog = walkingLogRepository.findById(walkingLogId)
                .orElseThrow(WalkingLogNotFoundException::new);

        List<PointDto> decodedTrail = decodePolyline(walkingLog.getTrail());

        return new WalkingLogDetailResponse(
                walkingLog.getCreatedAt(),
                walkingLog.getFinishedAt(),
                walkingLog.getDog().getProfileImage(),
                walkingLog.getDog().getName(),
                walkingLog.getTime(),
                walkingLog.getDistance(),
                decodedTrail
        );
    }

    @Transactional
    public void checkRedisLog(String loginId) throws JsonProcessingException {
        String key = "walking:" + loginId + ":startTime";
        Object value = redisTemplate.opsForValue().get(key);
        if (value != null) {
            WalkingEndRequest walkingEndRequest = new WalkingEndRequest(0, LocalDateTime.now());
            walkingEndService.endWalking(loginId, walkingEndRequest);
        }
    }


}
