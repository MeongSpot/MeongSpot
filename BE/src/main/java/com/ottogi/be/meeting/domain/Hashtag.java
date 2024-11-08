package com.ottogi.be.meeting.domain;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
public class Hashtag {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id")
    private Meeting meeting;

    @Column(length = 16, nullable = false)
    private String tag;

    @Builder
    public Hashtag(Meeting meeting, String tag) {
        this.meeting = meeting;
        this.tag = tag;
    }
}
