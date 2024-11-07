package com.ottogi.be.meeting.domain;

import com.ottogi.be.chat.domain.ChatRoom;
import com.ottogi.be.spot.domain.Spot;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@EntityListeners(AuditingEntityListener.class)
public class Meeting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "spot_id")
    private Spot spot;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom;

    @Column(length = 32, nullable = false)
    private String title;

    @Column(nullable = false)
    private int maxParticipants;

    @Column(nullable = false)
    private LocalDateTime meetingAt;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(length = 32)
    private String detailLocation;

    @Column(nullable = false)
    private Boolean isDone;

    @PrePersist
    protected void onCreate() {
        isDone = false;
    }
}
