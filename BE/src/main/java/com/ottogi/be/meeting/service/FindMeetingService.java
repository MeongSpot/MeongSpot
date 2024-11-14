package com.ottogi.be.meeting.service;

import com.ottogi.be.chat.domain.ChatMember;
import com.ottogi.be.chat.exception.ChatRoomNotFoundException;
import com.ottogi.be.chat.repository.ChatMemberRepository;
import com.ottogi.be.chat.service.FindChatRoomService;
import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.meeting.dto.*;
import com.ottogi.be.meeting.dto.response.FindMeetingResponse;
import com.ottogi.be.meeting.dto.response.FindMyMeetingResponse;
import com.ottogi.be.meeting.dto.response.MeetingResponse;
import com.ottogi.be.meeting.dto.response.MeetingTopResponse;
import com.ottogi.be.meeting.exception.MeetingNotFoundException;
import com.ottogi.be.meeting.repository.HashTagRepository;
import com.ottogi.be.meeting.repository.MeetingMemberRepository;
import com.ottogi.be.meeting.repository.MeetingRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import com.ottogi.be.spot.domain.Spot;
import com.ottogi.be.spot.exception.SpotNotFoundException;
import com.ottogi.be.spot.repository.SpotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FindMeetingService {

    private final SpotRepository spotRepository;
    private final MeetingRepository meetingRepository;
    private final HashTagRepository hashTagRepository;
    private final MeetingMemberRepository meetingMemberRepository;
    private final MemberRepository memberRepository;
    private final FindChatRoomService findChatRoomService;
    private final ChatMemberRepository chatMemberRepository;

    @Transactional(readOnly = true)
    public List<MeetingResponse> findMeetingList(MeetingDto meetingDto) {
        Spot spot = spotRepository.findById(meetingDto.getSpotId())
                .orElseThrow(SpotNotFoundException::new);

        List<Meeting> meetings = new ArrayList<>();
        if (meetingDto.getOrder().equals("recent")) {
            meetings = meetingRepository.findAllBySpotAndMeetingAtAfterOrderByIdDesc(spot, LocalDateTime.now());
        } else if (meetingDto.getOrder().equals("remain")) {
            meetings = meetingRepository.findAllBySpotAndMeetingAtAfterOrderByMeetingAt(spot, LocalDateTime.now());
        }

        List<MeetingHashtagDto> hashtags = hashTagRepository.findAllByMeetings(meetings);
        Map<Long, List<String>> hashtagMap = hashtags.stream()
                .collect(Collectors.groupingBy(MeetingHashtagDto::getMeetingId, Collectors.mapping(MeetingHashtagDto::getHashtag, Collectors.toList())));

        return meetings.stream()
                .map(meeting -> MeetingResponse.builder()
                        .meetingId(meeting.getId())
                        .title(meeting.getTitle())
                        .participants(meeting.getParticipants())
                        .maxParticipants(meeting.getMaxParticipants())
                        .meetingAt(meeting.getMeetingAt())
                        .detailLocation(meeting.getDetailLocation())
                        .hashtag(hashtagMap.getOrDefault(meeting.getId(), Collections.emptyList()))
                        .build()
                )
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MeetingTopResponse findMeetingTopList(Long spotId) {
        Spot spot = spotRepository.findById(spotId)
                .orElseThrow(SpotNotFoundException::new);
        List<Meeting> meetings = meetingRepository.findTop5BySpotAndMeetingAtAfterOrderByIdDesc(spot, LocalDateTime.now());

        List<MeetingHashtagDto> hashtags = hashTagRepository.findAllByMeetings(meetings);
        Map<Long, List<String>> hashtagMap = hashtags.stream()
                .collect(Collectors.groupingBy(MeetingHashtagDto::getMeetingId, Collectors.mapping(MeetingHashtagDto::getHashtag, Collectors.toList())));

        List<MeetingResponse> meetingResponses = meetings.stream()
                .map(meeting -> MeetingResponse.builder()
                        .meetingId(meeting.getId())
                        .title(meeting.getTitle())
                        .participants(meeting.getParticipants())
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

    @Transactional(readOnly = true)
    public FindMeetingResponse findMeeting(FindMeetingDto dto) {
        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);
        Meeting meeting = meetingRepository.findById(dto.getMeetingId())
                .orElseThrow(MeetingNotFoundException::new);

        Boolean isParticipate = meetingMemberRepository.existsByMemberAndMeeting(member, meeting);

        return FindMeetingResponse.of(meeting, isParticipate);
    }

    @Transactional
    public boolean isParticipate(Long dogId) {
        return meetingMemberRepository.existsByDogId(dogId);
    }

    @Transactional(readOnly = true)
    public List<FindMyMeetingResponse> findMyMeetingList(String loginId) {
        Member member = memberRepository.findByLoginId(loginId)
                .orElseThrow(MemberNotFoundException::new);

        List<Long> meetingMemberIdList = meetingMemberRepository.findMeetingIdsByMemberId(member.getId());

        List<FindMyMeetingResponse> result = new ArrayList<>();
        for (Long meetingId : meetingMemberIdList) {
            Meeting meeting = meetingRepository.findById(meetingId)
                    .orElseThrow(MeetingNotFoundException::new);

            String title = meeting.getTitle();
            int maxParticipants = meeting.getMaxParticipants();
            LocalDateTime meetingAt = meeting.getMeetingAt();
            int participants = meeting.getParticipants();
            String spot = meeting.getSpot().getName();
            List<String> hashtag = hashTagRepository.findTagsByMeeting(meeting);
            Long chatRoomId = meeting.getChatRoom().getId();

            ChatMember chatMember = chatMemberRepository.findByChatRoomIdAndMyId(chatRoomId, member.getId())
                    .orElseThrow(ChatRoomNotFoundException::new);

            long unreadMessageCnt = findChatRoomService.countUnreadMessage(chatRoomId, chatMember.getReadAt());

            FindMyMeetingResponse response = FindMyMeetingResponse.builder()
                    .meetingId(meeting.getId())
                    .title(title)
                    .maxParticipants(maxParticipants)
                    .meetingAt(meetingAt)
                    .unreadMessageCnt(unreadMessageCnt)
                    .chatRoomId(chatRoomId)
                    .hashtag(hashtag)
                    .spotName(spot)
                    .participants(participants)
                    .build();

            result.add(response);
        }
        return result;
    }
}
