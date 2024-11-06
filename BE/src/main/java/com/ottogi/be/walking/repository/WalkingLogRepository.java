package com.ottogi.be.walking.repository;

import com.ottogi.be.walking.domain.WalkingLog;
import com.ottogi.be.walking.dto.MonthlyWalkingLogDto;
import com.ottogi.be.walking.dto.WalkingLogDto;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface WalkingLogRepository extends JpaRepository<WalkingLog, Long> {
    @Query("""
            SELECT new com.ottogi.be.walking.dto.MonthlyWalkingLogDto( 
            dog.name, dog.profileImage, COUNT(w), SUM(w.distance),  
            SUM(TIMESTAMPDIFF(MINUTE, w.createdAt, w.finishedAt)))  
            FROM WalkingLog w 
            JOIN w.dog dog 
            WHERE w.member.id = :memberId AND w.createdAt >= :startOfMonth 
            GROUP BY dog.id
            """
    )
    List<MonthlyWalkingLogDto> findMonthlyStatsForMember(@Param("memberId") Long memberId,
                                                         @Param("startOfMonth") LocalDateTime startOfMonth);

    @Query("""
            SELECT new com.ottogi.be.walking.dto.WalkingLogDto(
            w.createdAt, dog.name, dog.image, w.distance, 
            TIMESTAMPDIFF(HOUR, w.createdAt, w.finishedAt), 
            TIMESTAMPDIFF(MINUTE, w.createdAt, w.finishedAt) % 60) 
            FROM WalkingLog w 
            JOIN w.dog dog 
            WHERE w.member.id = :memberId 
            ORDER BY w.createdAt DESC
            """
    )
    List<WalkingLogDto> findRecentWalksForMember(@Param("memberId") Long memberId);
}
