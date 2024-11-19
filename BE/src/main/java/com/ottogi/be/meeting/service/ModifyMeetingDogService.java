package com.ottogi.be.meeting.service;

import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.dog.repository.DogRepository;
import com.ottogi.be.dog.service.CheckOwnerService;
import com.ottogi.be.meeting.domain.Meeting;
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

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModifyMeetingDogService {

    private final MemberRepository memberRepository;
    private final MeetingRepository meetingRepository;
    private final MeetingMemberRepository meetingMemberRepository;
    private final DogRepository dogRepository;
    private final CheckOwnerService checkOwnerService;
    private final SaveMeetingMemberService saveMeetingMemberService;

    @Transactional
    public void modifyMeetingDog(ModifyMeetingDogDto dto) {
        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);
        Meeting meeting = meetingRepository.findById(dto.getMeetingId())
                .orElseThrow(MeetingNotFoundException::new);

        if (!meetingMemberRepository.existsByMemberAndMeeting(member, meeting)) throw new MemberNotInMeetingException();

        meetingMemberRepository.deleteAllByMemberAndMeeting(member, meeting);

        List<Dog> dogList = dogRepository.findAllById(dto.getDogIds());
        checkOwnerService.checkIsOwner(member, dogList);

        saveMeetingMemberService.saveMeetingMember(meeting, member, dogList);
    }
}
