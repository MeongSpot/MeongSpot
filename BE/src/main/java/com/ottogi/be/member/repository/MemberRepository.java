package com.ottogi.be.member.repository;

import com.ottogi.be.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByLoginId(String loginId);
    Optional<Member> findByNickname(String nickname);
    Optional<Member> findByPhone(String phone);
}
