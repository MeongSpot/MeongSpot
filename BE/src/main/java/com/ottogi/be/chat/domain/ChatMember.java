package com.ottogi.be.chat.domain;

import com.ottogi.be.member.domain.Member;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ChatMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    private LocalDateTime leftAt;

    private LocalDateTime readAt;

    @Builder
    public ChatMember(ChatRoom chatRoom, Member member) {
        this.chatRoom = chatRoom;
        this.member = member;
    }

    public void updateLeftAt() {
        this.leftAt = LocalDateTime.now();
    }

    public void updateReadAt() {
        this.readAt = LocalDateTime.now();
    }
}
