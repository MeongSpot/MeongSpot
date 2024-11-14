package com.ottogi.be.notification.domain;

import com.ottogi.be.member.domain.Member;
import com.ottogi.be.notification.domain.enums.Type;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@SuperBuilder
@SQLDelete(sql = "UPDATE notification SET is_deleted = true WHERE id = ?")
@Where(clause = "is_deleted = false")
@Inheritance(strategy = InheritanceType.JOINED)
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id",nullable = false)
    private Member receiver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id",nullable = false)
    private Member sender;

    @Column(nullable = false, length = 128)
    private String content;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Builder.Default
    @Column(name="is_read", nullable = false)
    private Boolean isRead = false;

    @Builder.Default
    @Column(name="is_deleted", nullable = false)
    private Boolean isDeleted = false;

    @Enumerated(EnumType.STRING)
    private Type type;

    @Column(name="friend_id")
    private Long friendId;

    @Column(name = "chat_room_id")
    private Long chatRoomId;


    public void read() {
        this.isRead = true;
    }
    public void delete() {
        this.isDeleted = true;
    }


}
