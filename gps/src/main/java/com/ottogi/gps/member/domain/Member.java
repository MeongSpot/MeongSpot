package com.ottogi.gps.member.domain;

import com.ottogi.gps.member.domain.enums.Gender;
import com.ottogi.gps.member.domain.enums.Role;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@SQLDelete(sql = "UPDATE member SET is_withdraw = true WHERE id = ?")
@SQLRestriction("is_withdraw != true")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 16)
    private String loginId;

    @Column(nullable = false, length = 256)
    private String password;

    @Column(nullable = false, length = 16)
    private String name;

    @Column(unique = true, nullable = false, length = 8)
    private String nickname;

    @Column(unique = true, nullable = false, length = 11)
    private String phone;

    @Column(nullable = false)
    private LocalDate birth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    private Role role;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Boolean isWithdraw;

    private LocalDateTime withdrawnAt;

    @Builder
    public Member(String loginId, String password, String name, String nickname, String phone, LocalDate birth, Gender gender) {
        this.loginId = loginId;
        this.password = password;
        this.name = name;
        this.nickname = nickname;
        this.phone = phone;
        this.birth = birth;
        this.gender = gender;
    }

    @PrePersist
    protected void onCreate() {
        isWithdraw = false;
        role = Role.ROLE_USER;
    }

    @PreRemove
    protected void onDelete() {
        this.withdrawnAt = LocalDateTime.now();
    }
}
