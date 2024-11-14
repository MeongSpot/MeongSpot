package com.ottogi.be.meeting.service;

import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.meeting.domain.MeetingMember;
import com.ottogi.be.meeting.repository.MeetingMemberRepository;
import com.ottogi.be.member.domain.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SaveMeetingMemberService {

    private final MeetingMemberRepository meetingMemberRepository;

    public void saveMeetingMember(Meeting meeting, Member member, List<Dog> dogList) {
        List<MeetingMember> meetingMemberList = new ArrayList<>();
        for (Dog dog : dogList) {
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
