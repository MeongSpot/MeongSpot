package com.ottogi.be.meeting.repository;

import com.ottogi.be.meeting.domain.Hashtag;
import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.meeting.dto.MeetingHashtagDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface HashTagRepository extends JpaRepository<Hashtag, Long> {
    @Query("SELECT h.tag FROM Hashtag h WHERE h.meeting = :meeting")
    List<String> findTagsByMeeting(Meeting meeting);

    @Modifying
    @Query("DELETE FROM Hashtag h WHERE h.meeting = :meeting")
    void deleteAllByMeeting(Meeting meeting);

    @Query("""
            SELECT NEW com.ottogi.be.meeting.dto.MeetingHashtagDto(h.meeting.id, h.tag)
            FROM Hashtag h
            WHERE h.meeting IN :meetings
            """)
    List<MeetingHashtagDto> findAllByMeetings(List<Meeting> meetings);

    @Query("""
            SELECT NEW com.ottogi.be.meeting.dto.MeetingHashtagDto(h.meeting.id, h.tag)
            FROM Hashtag h
            WHERE h.meeting.id IN :meetingIds
            """)
    List<MeetingHashtagDto> findAllByMeetingIds(List<Long> meetingIds);

    @Modifying
    @Query("DELETE FROM Hashtag h WHERE h.meeting.id IN :meetingIds")
    void deleteAllByMeetingIds(@Param("meetingIds") List<Long> meetingIds);

}
