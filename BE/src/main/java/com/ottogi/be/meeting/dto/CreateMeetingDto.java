package com.ottogi.be.meeting.dto;

import com.ottogi.be.chat.domain.ChatRoom;
import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.spot.domain.Spot;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class CreateMeetingDto {
    private Long spotId;
    private String loginId;
    private String title;
    private LocalDate date;
    private int hour;
    private int minute;
    private String detailLocation;
    private String information;
    private List<String> hashtags;
    private int maxParticipants;
    private List<Long> dogIds;

    public Meeting toEntity(Spot spot, ChatRoom chatRoom, LocalDateTime date) {
        return Meeting.builder()
                .spot(spot)
                .chatRoom(chatRoom)
                .title(title)
                .maxParticipants(maxParticipants)
                .meetingAt(date)
                .detailLocation(detailLocation)
                .information(information)
                .build();
    }
}
