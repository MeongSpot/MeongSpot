package com.ottogi.be.meeting.service;

import com.ottogi.be.chat.domain.ChatMember;
import com.ottogi.be.chat.domain.ChatRoom;
import com.ottogi.be.chat.repository.ChatMemberRepository;
import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.dog.exception.DogOwnerMismatchException;
import com.ottogi.be.dog.repository.DogRepository;
import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.meeting.domain.MeetingMember;
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

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JoinMeetingService {

    private final MemberRepository memberRepository;
    private final MeetingRepository meetingRepository;
    private final DogRepository dogRepository;
    private final MeetingMemberRepository meetingMemberRepository;
    private final ChatMemberRepository chatMemberRepository;

    @Transactional
    public void joinMeeting(JoinMeetingDto joinMeetingDto) {
        Member member = memberRepository.findByLoginId(joinMeetingDto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);
        Meeting meeting = meetingRepository.findById(joinMeetingDto.getMeetingId())
                .orElseThrow(MeetingNotFoundException::new);

        if (meetingMemberRepository.existsByMemberAndMeeting(member, meeting)) throw new AlreadyJoinException();

        List<Long> dogIds = joinMeetingDto.getDogIds();
        if (!dogRepository.isOwner(member, dogIds, dogIds.size())) throw new DogOwnerMismatchException();

        int participants = meetingMemberRepository.countMembersByMeeting(meeting);
        if (participants >= meeting.getMaxParticipants()) throw new OverMaxParticipantsException();

        List<Dog> dogs = dogRepository.findAllById(dogIds);
        List<MeetingMember> list = new ArrayList<>();
        for (Dog dog : dogs) {
            MeetingMember meetingMember = MeetingMember.builder()
                    .member(member)
                    .dog(dog)
                    .meeting(meeting)
                    .build();
            list.add(meetingMember);
        }
        meetingMemberRepository.saveAll(list);

        ChatRoom chatRoom = meeting.getChatRoom();
        ChatMember chatMember = ChatMember.builder()
                .member(member)
                .chatRoom(chatRoom)
                .build();
        chatMemberRepository.save(chatMember);
    }
}
