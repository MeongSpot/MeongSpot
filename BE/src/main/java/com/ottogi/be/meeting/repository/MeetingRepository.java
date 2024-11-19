package com.ottogi.be.meeting.repository;

import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.meeting.dto.DeleteMeetingDto;
import com.ottogi.be.spot.domain.Spot;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    List<Meeting> findAllBySpotAndMeetingAtAfterOrderByIdDesc(Spot spot, LocalDateTime now);
    List<Meeting> findAllBySpotAndMeetingAtAfterOrderByMeetingAt(Spot spot, LocalDateTime now);
    List<Meeting> findTop5BySpotAndMeetingAtAfterOrderByIdDesc(Spot spot, LocalDateTime now);

    @Query("""
        SELECT new com.ottogi.be.meeting.dto.DeleteMeetingDto(m.id, m.chatRoom.id)
        FROM Meeting m
        WHERE m.meetingAt < :cutoffTime
    """)
    List<DeleteMeetingDto> findAllFinishedMeeting(@Param("cutoffTime") LocalDateTime cutoffTime);

    @Modifying
    @Query("""
        DELETE FROM Meeting m WHERE m.id IN :meetingIds
    """)
    void deleteAllByMeetingIds(@Param("meetingIds") List<Long> meetingIds);

}
