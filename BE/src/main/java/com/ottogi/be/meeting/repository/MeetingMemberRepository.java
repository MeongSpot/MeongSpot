package com.ottogi.be.meeting.repository;

import com.ottogi.be.meeting.domain.MeetingMember;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingMemberRepository extends JpaRepository<MeetingMember, Long> {
}
