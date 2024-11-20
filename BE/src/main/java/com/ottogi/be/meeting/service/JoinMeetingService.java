package com.ottogi.be.meeting.service;

import com.ottogi.be.chat.dto.JoinMeetingChatRoomDto;
import com.ottogi.be.chat.service.JoinChatRoomService;
import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.dog.repository.DogRepository;
import com.ottogi.be.dog.service.CheckOwnerService;
import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.meeting.dto.JoinMeetingDto;
import com.ottogi.be.meeting.exception.AlreadyJoinException;
import com.ottogi.be.meeting.exception.MeetingNotFoundException;
import com.ottogi.be.meeting.exception.OverMaxParticipantsException;
import com.ottogi.be.meeting.repository.MeetingMemberRepository;
import com.ottogi.be.meeting.repository.MeetingRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
@RequiredArgsConstructor
public class JoinMeetingService {

    private final MemberRepository memberRepository;
    private final MeetingRepository meetingRepository;
    private final DogRepository dogRepository;
    private final MeetingMemberRepository meetingMemberRepository;
    private final JoinChatRoomService joinChatRoomService;
    private final SendJoinNotificationService sendJoinNotificationService;
    private final CheckOwnerService checkOwnerService;
    private final SaveMeetingMemberService saveMeetingMemberService;

    @Transactional
    public Long joinMeeting(JoinMeetingDto dto){

        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        Meeting meeting = meetingRepository.findById(dto.getMeetingId())
                .orElseThrow(MeetingNotFoundException::new);

        if (meetingMemberRepository.existsByMemberAndMeeting(member, meeting)) throw new AlreadyJoinException();

        List<Dog> dogList = dogRepository.findAllById(dto.getDogIds());
        checkOwnerService.checkIsOwner(member, dogList);

        if (meeting.getParticipants() >= meeting.getMaxParticipants()) throw new OverMaxParticipantsException();

        meeting.joinCount();

        saveMeetingMemberService.saveMeetingMember(meeting, member, dogList);

        joinChatRoomService.joinMeetingChatRoom(new JoinMeetingChatRoomDto(member, meeting.getChatRoom()));

        sendJoinNotificationService.sendMeetingJoinNotification(meeting,member);

        return meeting.getChatRoom().getId();
    }

}
