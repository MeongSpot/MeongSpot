package com.ottogi.be.meeting.service;

import com.ottogi.be.chat.dto.LeaveMeetingChatRoomDto;
import com.ottogi.be.chat.repository.ChatRoomRepository;
import com.ottogi.be.chat.service.LeaveChatRoomService;
import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.meeting.dto.LeaveMeetingDto;
import com.ottogi.be.meeting.exception.MeetingNotFoundException;
import com.ottogi.be.meeting.repository.HashTagRepository;
import com.ottogi.be.meeting.repository.MeetingMemberRepository;
import com.ottogi.be.meeting.repository.MeetingRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LeaveMeetingService {

    private final MemberRepository memberRepository;
    private final MeetingRepository meetingRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final MeetingMemberRepository meetingMemberRepository;
    private final HashTagRepository hashTagRepository;
    private final LeaveChatRoomService leaveChatRoomService;

    @Transactional
    public void leaveMeeting(LeaveMeetingDto dto) {
        Member member = memberRepository.findByLoginId(dto.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        Meeting meeting = meetingRepository.findById(dto.getMeetingId())
                .orElseThrow(MeetingNotFoundException::new);

        meetingMemberRepository.deleteAllByMemberAndMeeting(member, meeting);

        leaveChatRoomService.leaveMeetingChatRoom(new LeaveMeetingChatRoomDto(meeting.getChatRoom().getId(), member.getId(), member.getNickname()));

        if (meeting.getParticipants() > 1) {
            meeting.leaveCount();
        } else {
            deleteMeeting(meeting);
        }
    }

    @Transactional
    public void deleteMeeting(Meeting meeting) {
        hashTagRepository.deleteAllByMeeting(meeting);
        meetingRepository.delete(meeting);
        chatRoomRepository.delete(meeting.getChatRoom());
    }
}
