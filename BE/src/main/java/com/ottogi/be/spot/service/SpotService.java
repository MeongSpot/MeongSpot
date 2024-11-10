package com.ottogi.be.spot.service;

import com.ottogi.be.spot.domain.Spot;
import com.ottogi.be.spot.dto.SpotDto;
import com.ottogi.be.spot.dto.response.SpotResponse;
import com.ottogi.be.spot.repository.SpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SpotService {
    private final SpotRepository spotRepository;

    @Transactional
    public List<SpotResponse> findWalkingSpots(SpotDto dto){
        List<Spot> spots = spotRepository.findParksWithinRadius(dto.getLat(),dto.getLng(),dto.getRadius());
        //meetingcount조회 to-do

        return spots.stream()
                .map(spot -> SpotResponse.builder()
                        .meetingCnt(1)
                        .spotId(spot.getId())
                        .lat(spot.getLat())
                        .lng(spot.getLng())
                        .name(spot.getName())
                        .build())
                .collect(Collectors.toList());
    }
}
