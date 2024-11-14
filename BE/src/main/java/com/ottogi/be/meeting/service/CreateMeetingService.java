package com.ottogi.be.meeting.service;

import com.ottogi.be.chat.domain.ChatMember;
import com.ottogi.be.chat.domain.ChatRoom;
import com.ottogi.be.chat.domain.enums.ChatRoomType;
import com.ottogi.be.chat.repository.ChatMemberRepository;
import com.ottogi.be.chat.repository.ChatRoomRepository;
import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.dog.repository.DogRepository;
import com.ottogi.be.dog.service.CheckOwnerService;
import com.ottogi.be.meeting.constants.MeetingConstants;
import com.ottogi.be.meeting.domain.Hashtag;
import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.meeting.dto.CreateMeetingDto;
import com.ottogi.be.meeting.exception.InvalidMeetingTimeException;
import com.ottogi.be.meeting.repository.HashTagRepository;
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
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CreateMeetingService {

    private final SpotRepository spotRepository;
    private final MemberRepository memberRepository;
    private final DogRepository dogRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final MeetingRepository meetingRepository;
    private final HashTagRepository hashTagRepository;
    private final ChatMemberRepository chatMemberRepository;
    private final CheckOwnerService checkOwnerService;
    private final SaveMeetingMemberService saveMeetingMemberService;

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

        ChatRoom chatRoom = new ChatRoom(ChatRoomType.MEETING);
        ChatRoom chat = chatRoomRepository.saveAndFlush(chatRoom);
        ChatMember chatMember = ChatMember.builder()
                .chatRoom(chat)
                .member(member)
                .build();
        chatMemberRepository.save(chatMember);

        Meeting meetingEntity = dto.toEntity(meetingSpot, chat, meetingStartTime);
        Meeting meeting = meetingRepository.saveAndFlush(meetingEntity);

        List<String> hashtag = dto.getHashtag();
        if (hashtag != null && !hashtag.isEmpty()) {
            List<Hashtag> tags = new ArrayList<>();
            for (String hashtagItem : hashtag) {
                Hashtag tag= Hashtag.builder()
                        .meeting(meeting)
                        .tag(hashtagItem)
                        .build();
                tags.add(tag);
            }
            hashTagRepository.saveAll(tags);
        }

        saveMeetingMemberService.saveMeetingMember(meeting, member, dogList);

    }
}
