package com.ottogi.be.walking.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.dog.repository.DogRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import com.ottogi.be.walking.domain.WalkingLog;
import com.ottogi.be.walking.dto.request.WalkingEndRequest;
import com.ottogi.be.walking.repository.WalkingLogRepository;
import com.ottogi.be.walking.repository.WalkingRedisRepository;
import com.ottogi.be.walking.util.PolylineUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.ottogi.be.walking.dto.PointDto;
import com.ottogi.be.dog.exception.DogNotFoundException;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WalkingEndService {
    private final MemberRepository memberRepository;
    private final WalkingRedisRepository walkingRedisRepository;
    private final WalkingLogRepository walkingLogRepository;
    private final DogRepository dogRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();
    @Transactional
    public void endWalking(String loginId, WalkingEndRequest request){
        Member member = memberRepository.findByLoginId(loginId).orElseThrow(MemberNotFoundException::new);

        List<Object> gpsCoordinates = walkingRedisRepository.getGpsData(loginId);
        List<PointDto> latLngList = parseGpsCoordinates(gpsCoordinates);
        List<Object> dogIds = walkingRedisRepository.getDogIds(loginId);

        Set<Long> dogIdSet = new HashSet<>();
        for(Object dogId : dogIds) {
            if (dogId instanceof Integer) {
                dogIdSet.add(((Integer) dogId).longValue());
            } else {
                dogIdSet.add((Long) dogId);
            }
        }

        Long startTimeEpoch = walkingRedisRepository.getStartTime(loginId);
        LocalDateTime startDateTime = Instant.ofEpochSecond(startTimeEpoch)
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        String trail = PolylineUtils.encodePolyline(latLngList.stream()
                .map(dto -> new PointDto(dto.getLat(), dto.getLng()))
                .collect(Collectors.toList()));


        for (Long dogId : dogIdSet) {

            Dog dog = dogRepository.findById(dogId).orElseThrow(DogNotFoundException::new);

            WalkingLog walkingLog = WalkingLog.builder()
                    .member(member)
                    .dog(dog)
                    .createdAt(startDateTime)
                    .finishedAt(request.getFinishedAt())
                    .distance(request.getDistance())
                    .trail(trail)
                    .build();
            walkingLogRepository.save(walkingLog);
        }
        
        walkingRedisRepository.deleteWalkingData(loginId);
    }

    private List<PointDto> parseGpsCoordinates(List<Object> gpsCoordinates){
        List<PointDto> latLngList = new ArrayList<>();

        for (Object obj : gpsCoordinates) {
            String coordStr = obj.toString().replace("\"", "");
            String[] parts = coordStr.split(",");
            double lat = Double.parseDouble(parts[0]);
            double lng = Double.parseDouble(parts[1]);
            latLngList.add(new PointDto(lat, lng));
        }

        return latLngList;
    }
}
