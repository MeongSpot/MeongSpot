package com.ottogi.be.walking.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.dog.repository.DogRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import com.ottogi.be.walking.domain.WalkingLog;
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
import java.util.List;
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
    public void endWalking(String loginId) throws JsonProcessingException {
        Member member = memberRepository.findByLoginId(loginId).orElseThrow(MemberNotFoundException::new);
        Long userId = member.getId();


        List<Object> gpsCoordinates = walkingRedisRepository.getGpsData(userId);
        List<PointDto> latLngList = parseGpsCoordinates(gpsCoordinates);
        List<Object> dogIds = walkingRedisRepository.getDogIds(userId);
        List<Long> parsedDogIds = parseDogIds(dogIds);

        Long startTimeEpoch = walkingRedisRepository.getStartTime(userId);
        LocalDateTime startDateTime = Instant.ofEpochSecond(startTimeEpoch)
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        Long endTimeEpoch = Instant.now().getEpochSecond();
        LocalDateTime endDateTime = Instant.ofEpochSecond(endTimeEpoch)
                .atZone(ZoneId.systemDefault())
                .toLocalDateTime();

        double distance = calculateDistance(latLngList);
        String trail = PolylineUtils.encodePolyline(latLngList.stream()
                .map(dto -> new PointDto(dto.getLat(), dto.getLng()))
                .collect(Collectors.toList()));


        for (Long dogId : parsedDogIds) {
            Dog dog = dogRepository.findById(dogId).orElseThrow(DogNotFoundException::new);

            WalkingLog walkingLog = WalkingLog.builder()
                    .member(member)
                    .dog(dog)
                    .createdAt(startDateTime)
                    .finishedAt(endDateTime)
                    .distance(distance)
                    .trail(trail)
                    .build();
            walkingLogRepository.save(walkingLog);
        }
        
        walkingRedisRepository.deleteWalkingData(userId);
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

    List<Long> parseDogIds(List<Object> dogIds) throws JsonProcessingException {
        List<Long> parsedDogIds = new ArrayList<>();
        for (Object dogIdObj : dogIds) {

            String jsonStr = dogIdObj.toString();
            System.out.println("JSON String: " + jsonStr);
            JsonNode rootNode = objectMapper.readTree(jsonStr);

            for (JsonNode idNode : rootNode) {
                parsedDogIds.add(idNode.asLong());
            }
        }
        return parsedDogIds;
    }

    private double calculateDistance(List<PointDto> latLngList){
        double totalDistance = 0.0;

        for (int i = 1; i < latLngList.size(); i++) {
            PointDto point1 = latLngList.get(i - 1);
            PointDto point2 = latLngList.get(i);

            double lat1 = point1.getLat();
            double lon1 = point1.getLng();
            double lat2 = point2.getLat();
            double lon2 = point2.getLng();

            totalDistance += haversine(lat1, lon1, lat2, lon2);
        }

        return totalDistance;
    }

    private double haversine(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371;
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
                Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) *
                        Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
