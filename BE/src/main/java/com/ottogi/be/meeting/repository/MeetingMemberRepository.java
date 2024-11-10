package com.ottogi.be.meeting.repository;

import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.meeting.domain.MeetingMember;
import com.ottogi.be.meeting.dto.MeetingMemberCountDto;
import com.ottogi.be.member.domain.Member;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MeetingMemberRepository extends JpaRepository<MeetingMember, Long> {
    @Query("SELECT DISTINCT COUNT(*) FROM MeetingMember mm WHERE mm.meeting = :meeting")
    int countMembersByMeeting(@Param("meeting") Meeting meeting);

    @Query("""
            SELECT NEW com.ottogi.be.meeting.dto.MeetingMemberCountDto(
            mm.meeting.id, COUNT(DISTINCT mm.member)
            )
            FROM MeetingMember mm
            WHERE mm.meeting.id IN :meetingIds
            GROUP BY mm.meeting.id
            """)
    List<MeetingMemberCountDto> countMembersByMeetingIds(List<Long> meetingIds);

    boolean existsByMemberAndMeeting(Member member, Meeting meeting);
}
