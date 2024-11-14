package com.ottogi.be.meeting.service;

import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.dog.exception.DogOwnerMismatchException;
import com.ottogi.be.dog.repository.DogRepository;
import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.meeting.domain.MeetingMember;
import com.ottogi.be.meeting.dto.ModifyMeetingDogDto;
import com.ottogi.be.meeting.exception.MeetingNotFoundException;
import com.ottogi.be.meeting.exception.MemberNotInMeetingException;
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
public class ModifyMeetingDogService {

    private final MemberRepository memberRepository;
    private final MeetingRepository meetingRepository;
    private final MeetingMemberRepository meetingMemberRepository;
    private final DogRepository dogRepository;

    @Transactional
    public void modifyMeetingDog(ModifyMeetingDogDto dto) {
        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);
        Meeting meeting = meetingRepository.findById(dto.getMeetingId())
                .orElseThrow(MeetingNotFoundException::new);

        if (!meetingMemberRepository.existsByMemberAndMeeting(member, meeting)) throw new MemberNotInMeetingException();

        meetingMemberRepository.deleteAllByMemberAndMeeting(member, meeting);

        List<Long> dogIds = dto.getDogIds();
        if (!dogRepository.isOwner(member, dogIds, dogIds.size())) throw new DogOwnerMismatchException();

        List<Dog> dogs = dogRepository.findAllById(dogIds);
        List<MeetingMember> meetingMemberList = new ArrayList<>();
        for (Dog dog : dogs) {
            MeetingMember meetingMember = MeetingMember.builder()
                    .meeting(meeting)
                    .member(member)
                    .dog(dog)
                    .build();
            meetingMemberList.add(meetingMember);
        }
        meetingMemberRepository.saveAll(meetingMemberList);
    }
}
