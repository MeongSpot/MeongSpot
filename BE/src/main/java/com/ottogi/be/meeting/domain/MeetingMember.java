package com.ottogi.be.meeting.domain;

import com.ottogi.be.dog.domain.Dog;
import com.ottogi.be.member.domain.Member;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class MeetingMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dog_id")
    private Dog dog;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id")
    private Meeting meeting;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime joinAt;

    @Column(nullable = false)
    private Boolean isAlarm;

    @Builder
    public MeetingMember(Member member, Dog dog, Meeting meeting) {
        this.member = member;
        this.dog = dog;
        this.meeting = meeting;
        this.isAlarm = true;
    }
}
