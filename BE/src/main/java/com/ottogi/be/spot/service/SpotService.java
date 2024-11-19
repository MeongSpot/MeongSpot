package com.ottogi.be.spot.service;

import com.ottogi.be.meeting.repository.MeetingRepository;
import com.ottogi.be.spot.domain.Spot;
import com.ottogi.be.spot.dto.SpotDto;
import com.ottogi.be.spot.dto.response.SpotResponse;
import com.ottogi.be.spot.repository.SpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpotService {
    private final SpotRepository spotRepository;
    private final MeetingRepository meetingRepository;

    @Transactional
    public List<SpotResponse> findWalkingSpots(SpotDto dto){
        List<Spot> spots = spotRepository.findParksWithinRadius(dto.getLat(),dto.getLng(),dto.getRadius());
        List<Long> spotIds = spots.stream().map(Spot::getId).collect(Collectors.toList());
        Map<Long, Long> meetingCounts = spotRepository.countMeetingsBySpotsAndIsNotDone(spotIds)
                .stream()
                .collect(Collectors.toMap(
                        result -> result.getSpotId(),
                        result -> result.getMeetingCount()
                ));

        return spots.stream()
                .map(spot -> SpotResponse.builder()
                        .meetingCnt(meetingCounts.getOrDefault(spot.getId(), 0L).intValue())
                        .spotId(spot.getId())
                        .lat(spot.getLat())
                        .lng(spot.getLng())
                        .name(spot.getName())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public List<SpotResponse> findHotWalkingSpots(SpotDto dto) {
        List<Spot> spots = spotRepository.findParksWithinRadius(dto.getLat(), dto.getLng(), dto.getRadius());

        Map<Long, Long> meetingCounts = spotRepository.countMeetingsBySpotsAndIsNotDone(
                spots.stream().map(Spot::getId).collect(Collectors.toList())
        ).stream().collect(Collectors.toMap(
                result -> result.getSpotId(),
                result -> result.getMeetingCount()
        ));

        return spots.stream()
                .map(spot -> SpotResponse.builder()
                        .meetingCnt(meetingCounts.getOrDefault(spot.getId(), 0L).intValue())
                        .spotId(spot.getId())
                        .lat(spot.getLat())
                        .lng(spot.getLng())
                        .name(spot.getName())
                        .build())
                .sorted(Comparator.comparingInt(SpotResponse::getMeetingCnt).reversed())
                .limit(5)
                .collect(Collectors.toList());
    }


}
