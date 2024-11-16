package com.ottogi.be.meeting.service;

import com.ottogi.be.chat.domain.ChatRoom;
import com.ottogi.be.chat.service.CreateChatRoomService;
import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.dog.repository.DogRepository;
import com.ottogi.be.dog.service.CheckOwnerService;
import com.ottogi.be.meeting.constants.MeetingConstants;
import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.meeting.dto.CreateMeetingDto;
import com.ottogi.be.meeting.exception.InvalidMeetingTimeException;
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

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CreateMeetingService {

    private final SpotRepository spotRepository;
    private final MemberRepository memberRepository;
    private final DogRepository dogRepository;
    private final MeetingRepository meetingRepository;
    private final CheckOwnerService checkOwnerService;
    private final SaveMeetingMemberService saveMeetingMemberService;
    private final CreateChatRoomService createChatRoomService;
    private final CreateHashtagService createHashtagService;

    @Transactional
    public void addMeeting(CreateMeetingDto dto) {
        Spot meetingSpot = spotRepository.findById(dto.getSpotId())
                .orElseThrow(SpotNotFoundException::new);

        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        LocalDate meetingDate = dto.getDate();
        LocalDateTime meetingStartTime = meetingDate.atTime(dto.getHour(), dto.getMinute());
        LocalDateTime currentTime = LocalDateTime.now();
        if (meetingStartTime.isBefore(currentTime)) throw new InvalidMeetingTimeException();
        if (meetingDate.isAfter(currentTime.toLocalDate().plusWeeks(MeetingConstants.MEETING_CREATION_LIMIT_WEEKS))) throw new InvalidMeetingTimeException();

        List<Dog> dogList = dogRepository.findAllById(dto.getDogIds());
        checkOwnerService.checkIsOwner(member, dogList);

        ChatRoom chat = createChatRoomService.addMeetingChatRoom(member);

        Meeting meetingEntity = dto.toEntity(meetingSpot, chat, meetingStartTime);
        Meeting meeting = meetingRepository.saveAndFlush(meetingEntity);

        createHashtagService.addHashtag(dto.getHashtag(), meeting);

        saveMeetingMemberService.saveMeetingMember(meeting, member, dogList);
    }
}
