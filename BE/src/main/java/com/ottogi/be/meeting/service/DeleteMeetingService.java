package com.ottogi.be.meeting.service;

import com.ottogi.be.chat.repository.ChatMemberRepository;
import com.ottogi.be.chat.repository.ChatRoomRepository;
import com.ottogi.be.meeting.dto.DeleteMeetingDto;
import com.ottogi.be.meeting.repository.HashTagRepository;
import com.ottogi.be.meeting.repository.MeetingMemberRepository;
import com.ottogi.be.meeting.repository.MeetingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DeleteMeetingService {

    private final MeetingRepository meetingRepository;
    private final ChatMemberRepository chatMemberRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final HashTagRepository hashTagRepository;
    private final MeetingMemberRepository meetingMemberRepository;

    @Transactional
    @Scheduled(cron = "0 0 0 * * ?")
    public void deleteMeeting() {

        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(12);
        List<DeleteMeetingDto> finishedMeetingList = meetingRepository.findAllFinishedMeeting(cutoffTime);

        List<Long> meetingIds = finishedMeetingList.stream()
                .map(DeleteMeetingDto::getMeetingId)
                .toList();

        List<Long> chatRoomIds = finishedMeetingList.stream()
                .map(DeleteMeetingDto::getChatRoomId)
                .toList();

        if (!meetingIds.isEmpty() && !chatRoomIds.isEmpty()) {
            // 미팅 아이디에 해당하는 chatMember 삭제
            chatMemberRepository.deleteByChatRoomIds(chatRoomIds);

            // 해시태그 삭제
            hashTagRepository.deleteAllByMeetingIds(meetingIds);

            // 미팅 멤버 삭제
            meetingMemberRepository.deleteAllByMeetingIds(meetingIds);

            // 미팅 삭제
            meetingRepository.deleteAllByMeetingIds(meetingIds);

            // chatRoom 삭제
            chatRoomRepository.deleteAllByChatRoomIds(chatRoomIds);
        }
    }
}
