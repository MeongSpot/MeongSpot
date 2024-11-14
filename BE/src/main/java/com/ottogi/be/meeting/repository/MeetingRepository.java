package com.ottogi.be.meeting.repository;

import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.spot.domain.Spot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    List<Meeting> findAllBySpotAndMeetingAtAfterOrderByIdDesc(Spot spot, LocalDateTime now);
    List<Meeting> findAllBySpotAndMeetingAtAfterOrderByMeetingAt(Spot spot, LocalDateTime now);
    List<Meeting> findTop5BySpotAndMeetingAtAfterOrderByIdDesc(Spot spot, LocalDateTime now);

    @Query("SELECT m.chatRoom.id FROM Meeting m WHERE m.id IN :meetingIds")
    List<Long> findChatRoomIdByIds(List<Long> meetingIds);

    long countBySpot(Spot spot);
}
