package com.ottogi.be.meeting.repository;

import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.spot.domain.Spot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    List<Meeting> findAllBySpotAndMeetingAtAfterOrderByIdDesc(Spot spot, LocalDateTime now);
    List<Meeting> findAllBySpotAndMeetingAtAfterOrderByMeetingAt(Spot spot, LocalDateTime now);
    List<Meeting> findTop5BySpotAndMeetingAtAfterOrderByIdDesc(Spot spot, LocalDateTime now);
}
