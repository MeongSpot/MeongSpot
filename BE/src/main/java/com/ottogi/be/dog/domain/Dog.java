package com.ottogi.be.dog.domain;

import com.ottogi.be.dog.domain.enums.Gender;
import com.ottogi.be.dog.domain.enums.Size;
import com.ottogi.be.member.domain.Member;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;

@Entity
@Getter
@SQLDelete(sql = "UPDATE dog SET is_delete = true where id =?")
@SQLRestriction("is_delete != true")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Dog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private Member member;

    @Column(length = 16, nullable = false)
    private String name;

    private LocalDate birth;

    @Column(length = 128)
    private String introduction;

    @Column(length = 6, nullable = false)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(nullable = false)
    private Boolean isNeuter;

    @Column(length = 256, nullable = false)
    private String profileImage;

    @Column(length = 6, nullable = false)
    @Enumerated(EnumType.STRING)
    private Size size;

    @Column(nullable = false)
    private int age;

    @Column(length = 32, nullable = false)
    private String breed;

    @Column(nullable = false)
    private Boolean isDelete;

    @PrePersist
    protected void onCreate() {
        isDelete = false;
    }

    @Builder
    public Dog(Member member, String profileImage, String name, String breed, Size size,
               int age, Gender gender, boolean isNeuter, LocalDate birth, String introduction) {
        this.member = member;
        this.profileImage = profileImage;
        this.name = name;
        this.breed = breed;
        this.size = size;
        this.age = age;
        this.gender = gender;
        this.isNeuter = isNeuter;
        this.birth = birth;
        this.introduction = introduction;
    }

    public void updateInformation(String profileImage, String name, String breed, Size size, int age, Gender gender, Boolean isNeuter, LocalDate birth, String introduction) {
        this.profileImage = profileImage;
        this.name = name;
        this.breed = breed;
        this.size = size;
        this.age = age;
        this.gender = gender;
        this.isNeuter = isNeuter;
        this.birth = birth;
        this.introduction = introduction;
    }
}
