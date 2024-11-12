package com.ottogi.be.member.repository;

import com.ottogi.be.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {

    Optional<Member> findByLoginId(String loginId);
    Optional<Member> findByNickname(String nickname);
    Optional<Member> findByPhone(String phone);

    @Query("""
        SELECT m
        FROM Member m
        LEFT JOIN FETCH m.dogList
        WHERE m.nickname LIKE %:nickname%
        ORDER BY CASE
        WHEN m.nickname LIKE :nickname THEN 0
        WHEN m.nickname LIKE :nickname% THEN 1
        WHEN m.nickname LIKE %:nickname THEN 2
        WHEN m.nickname LIKE %:nickname% THEN 3
        ELSE 4
        END
    """)
    List<Member> searchByNickname(@Param("nickname") String nickname);
}
