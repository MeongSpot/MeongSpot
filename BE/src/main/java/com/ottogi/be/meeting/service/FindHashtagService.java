package com.ottogi.be.meeting.service;

import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.meeting.exception.MeetingNotFoundException;
import com.ottogi.be.meeting.repository.HashTagRepository;
import com.ottogi.be.meeting.repository.MeetingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FindHashtagService {

    private final MeetingRepository meetingRepository;
    private final HashTagRepository hashTagRepository;

    @Transactional(readOnly = true)
    public List<String> findHashTag(Long meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(MeetingNotFoundException::new);
        return hashTagRepository.findTagsByMeeting(meeting);
    }
}
