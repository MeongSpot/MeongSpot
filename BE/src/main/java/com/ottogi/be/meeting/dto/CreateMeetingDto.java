package com.ottogi.be.meeting.dto;

import com.ottogi.be.chat.domain.ChatRoom;
import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.meeting.dto.request.CreateMeetingRequest;
import com.ottogi.be.spot.domain.Spot;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
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
    private List<String> hashtag;
    private int maxParticipants;
    private List<Long> dogIds;

    public static CreateMeetingDto toDto(CreateMeetingRequest request, String loginId) {
        return CreateMeetingDto.builder()
                .spotId(request.getSpotId())
                .loginId(loginId)
                .title(request.getTitle())
                .date(request.getDate())
                .hour(request.getHour())
                .minute(request.getMinute())
                .detailLocation(request.getDetailLocation())
                .information(request.getInformation())
                .hashtag(request.getHashtag())
                .maxParticipants(request.getMaxParticipants())
                .dogIds(request.getDogs())
                .build();
    }

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
