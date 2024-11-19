package com.ottogi.be.member.service;

import com.ottogi.be.meeting.repository.MeetingMemberRepository;
import com.ottogi.be.member.dto.response.FindMeetingMemberResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FindMeetingMemberService {

    private final MeetingMemberRepository meetingMemberRepository;

    public List<FindMeetingMemberResponse> findMeetingMemberList(Long meetingId) {
        return meetingMemberRepository.findMemberByMeetingId(meetingId);
    }
}
