package com.ottogi.chat.repository;

import com.ottogi.chat.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
}
