package com.ottogi.be.walking.domain;

import jakarta.persistence.*;
import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.member.domain.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "walking_log")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class WalkingLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dog_id", nullable = false)
    private Dog dog;

    @CreationTimestamp
    @Column(name = "started_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "finished_at",nullable = false)
    private LocalDateTime finishedAt;

    @Column(nullable = false)
    private double distance;

    @Column(columnDefinition = "LONGTEXT",nullable = false)
    private String trail;

    @Builder
    public WalkingLog(Member member, Dog dog, LocalDateTime createdAt, LocalDateTime finishedAt, double distance, String trail) {
        this.member = member;
        this.dog = dog;
        this.createdAt = createdAt;
        this.finishedAt = finishedAt;
        this.distance = distance;
        this.trail = trail;
    }
}
