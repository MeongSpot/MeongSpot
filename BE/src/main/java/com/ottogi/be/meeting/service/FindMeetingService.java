package com.ottogi.be.meeting.service;

import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.meeting.dto.MeetingDto;
import com.ottogi.be.meeting.dto.MeetingHashtagDto;
import com.ottogi.be.meeting.dto.MeetingMemberCountDto;
import com.ottogi.be.meeting.dto.response.MeetingResponse;
import com.ottogi.be.meeting.dto.response.MeetingTopResponse;
import com.ottogi.be.meeting.repository.HashTagRepository;
import com.ottogi.be.meeting.repository.MeetingMemberRepository;
import com.ottogi.be.meeting.repository.MeetingRepository;
import com.ottogi.be.spot.domain.Spot;
import com.ottogi.be.spot.exception.SpotNotFoundException;
import com.ottogi.be.spot.repository.SpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FindMeetingService {

    private final SpotRepository spotRepository;
    private final MeetingRepository meetingRepository;
    private final MeetingMemberRepository meetingMemberRepository;
    private final HashTagRepository hashTagRepository;

    public List<MeetingResponse> findMeetingList(MeetingDto meetingDto) {
        Spot spot = spotRepository.findById(meetingDto.getSpotId())
                .orElseThrow(SpotNotFoundException::new);
        List<Meeting> meetings = new ArrayList<>();
        if (meetingDto.getOrder().equals("recent")) {
            meetings = meetingRepository.findAllBySpotAndMeetingAtAfterOrderByIdDesc(spot, LocalDateTime.now());
        } else if (meetingDto.getOrder().equals("remain")) {
            meetings = meetingRepository.findAllBySpotAndMeetingAtAfterOrderByMeetingAt(spot, LocalDateTime.now());
        }

        List<Long> meetingIds = meetings.stream().map(Meeting::getId).toList();

        List<MeetingMemberCountDto> counts = meetingMemberRepository.countMembersByMeetingIds(meetingIds);
        Map<Long, Integer> countsMap = counts.stream()
                .collect(Collectors.toMap(MeetingMemberCountDto::getMeetingId, meetingMemberCountDto -> meetingMemberCountDto.getCount().intValue()));

        List<MeetingHashtagDto> hashtags = hashTagRepository.findAllByMeetingIds(meetingIds);
        Map<Long, List<String>> hashtagMap = hashtags.stream()
                .collect(Collectors.groupingBy(MeetingHashtagDto::getMeetingId, Collectors.mapping(MeetingHashtagDto::getHashtag, Collectors.toList())));

        return meetings.stream()
                .map(meeting -> MeetingResponse.builder()
                        .meetingId(meeting.getId())
                        .title(meeting.getTitle())
                        .participants(countsMap.get(meeting.getId()))
                        .maxParticipants(meeting.getMaxParticipants())
                        .meetingAt(meeting.getMeetingAt())
                        .detailLocation(meeting.getDetailLocation())
                        .hashtag(hashtagMap.getOrDefault(meeting.getId(), Collections.emptyList()))
                        .build()
                )
                .collect(Collectors.toList());
    }

    public MeetingTopResponse findMeetingTopList(Long spotId) {
        Spot spot = spotRepository.findById(spotId)
                .orElseThrow(SpotNotFoundException::new);
        List<Meeting> meetings = meetingRepository.findTop5BySpotAndMeetingAtAfterOrderByIdDesc(spot, LocalDateTime.now());

        List<Long> meetingIds = meetings.stream().map(Meeting::getId).toList();

        List<MeetingMemberCountDto> counts = meetingMemberRepository.countMembersByMeetingIds(meetingIds);
        Map<Long, Integer> countsMap = counts.stream()
                .collect(Collectors.toMap(MeetingMemberCountDto::getMeetingId, meetingMemberCountDto -> meetingMemberCountDto.getCount().intValue()));

        List<MeetingHashtagDto> hashtags = hashTagRepository.findAllByMeetingIds(meetingIds);
        Map<Long, List<String>> hashtagMap = hashtags.stream()
                .collect(Collectors.groupingBy(MeetingHashtagDto::getMeetingId, Collectors.mapping(MeetingHashtagDto::getHashtag, Collectors.toList())));

        List<MeetingResponse> meetingResponses = meetings.stream()
                .map(meeting -> MeetingResponse.builder()
                        .meetingId(meeting.getId())
                        .title(meeting.getTitle())
                        .participants(countsMap.get(meeting.getId()))
                        .maxParticipants(meeting.getMaxParticipants())
                        .meetingAt(meeting.getMeetingAt())
                        .detailLocation(meeting.getDetailLocation())
                        .hashtag(hashtagMap.getOrDefault(meeting.getId(), Collections.emptyList()))
                        .build()
                )
                .toList();

        return MeetingTopResponse.builder()
                .spotName(spot.getName())
                .meetings(meetingResponses)
                .build();
    }
}
