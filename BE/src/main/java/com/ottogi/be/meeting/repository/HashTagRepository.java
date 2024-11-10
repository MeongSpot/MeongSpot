package com.ottogi.be.meeting.repository;

import com.ottogi.be.meeting.domain.Hashtag;
import com.ottogi.be.meeting.dto.MeetingHashtagDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HashTagRepository extends JpaRepository<Hashtag, Long> {
    @Query("""
            SELECT NEW com.ottogi.be.meeting.dto.MeetingHashtagDto(h.meeting.id, h.tag)
            FROM Hashtag h
            WHERE h.meeting.id in :meetingIds
            """)
    List<MeetingHashtagDto> findAllByMeetingIds(List<Long> meetingIds);
}
