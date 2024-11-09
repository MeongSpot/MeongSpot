package com.ottogi.be.meeting.repository;

import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.meeting.domain.MeetingMember;
import com.ottogi.be.member.domain.Member;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MeetingMemberRepository extends JpaRepository<MeetingMember, Long> {
    @Query("SELECT DISTINCT COUNT(*) FROM MeetingMember mm WHERE mm.meeting = :meeting")
    int countMembersByMeeting(@Param("meeting") Meeting meeting);

    boolean existsByMemberAndMeeting(Member member, Meeting meeting);
}
