package com.ottogi.be.dog.repository;

import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.friend.dto.FriendDto;
import com.ottogi.be.member.domain.Member;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DogRepository extends JpaRepository<Dog, Long> {
    @Query("SELECT d FROM Dog d WHERE d.member = :member")
    List<Dog> findByMember(Member member);

    @Query("SELECT d.name FROM Dog d WHERE d.member = :member")
    List<String> findDogsNameByMember(Member member);

    @Query("""
            SELECT new com.ottogi.be.friend.dto.FriendDto(
            m.id, m.profileImage, m.nickname, d.name)
            FROM Member m
            LEFT JOIN FETCH Dog d ON d.member.id = m.id
            WHERE m.id IN :memberIds
            ORDER BY m.id ASC
            """)
    List<FriendDto> findAllByMemberId(@Param("memberIds") List<Long> memberIds);

    @Query("""
            SELECT COUNT(d) = 0
            FROM Dog d
            WHERE d.id IN :dogIds AND d.member != :member
            """)
    Boolean isOwner(@Param("member") Member member, @Param("dogIds") List<Long> dogIds);
}
