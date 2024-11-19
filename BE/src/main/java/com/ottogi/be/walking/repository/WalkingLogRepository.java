package com.ottogi.be.walking.repository;

import com.ottogi.be.walking.domain.WalkingLog;
import com.ottogi.be.walking.dto.MonthlyWalkingLogDto;
import com.ottogi.be.walking.dto.WalkingLogDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface WalkingLogRepository extends JpaRepository<WalkingLog, Long> {

    @Query(
            """
            SELECT new com.ottogi.be.walking.dto.MonthlyWalkingLogDto(
                dog.profileImage,
                dog.name,
                COUNT(w),
                SUM(w.time),
                SUM(w.distance)
            )
            FROM WalkingLog w
            JOIN w.dog dog
            WHERE w.member.id = :memberId
            AND w.createdAt >= :startOfMonth
            GROUP BY dog.id
            """
    )
    List<MonthlyWalkingLogDto> findMonthlyStatsForMember(@Param("memberId") Long memberId,
                                                         @Param("startOfMonth") LocalDateTime startOfMonth);

    @Query("""
            SELECT new com.ottogi.be.walking.dto.WalkingLogDto(
                w.id,
                w.createdAt,
                dog.profileImage,
                dog.name,
                w.time,
                w.distance
            )
            FROM WalkingLog w
            JOIN w.dog dog
            WHERE w.member.id = :memberId
            ORDER BY w.createdAt DESC
            """
    )
    List<WalkingLogDto> findRecentWalksForMember(@Param("memberId") Long memberId);
}
