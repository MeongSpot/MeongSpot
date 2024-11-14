package com.ottogi.be.member.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QMember is a Querydsl query type for Member
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMember extends EntityPathBase<Member> {

    private static final long serialVersionUID = -855078980L;

    public static final QMember member = new QMember("member1");

    public final DatePath<java.time.LocalDate> birth = createDate("birth", java.time.LocalDate.class);

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final ListPath<com.ottogi.be.dog.domain.Dog, com.ottogi.be.dog.domain.QDog> dogList = this.<com.ottogi.be.dog.domain.Dog, com.ottogi.be.dog.domain.QDog>createList("dogList", com.ottogi.be.dog.domain.Dog.class, com.ottogi.be.dog.domain.QDog.class, PathInits.DIRECT2);

    public final EnumPath<com.ottogi.be.member.domain.enums.Gender> gender = createEnum("gender", com.ottogi.be.member.domain.enums.Gender.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isWithdraw = createBoolean("isWithdraw");

    public final StringPath loginId = createString("loginId");

    public final StringPath name = createString("name");

    public final StringPath nickname = createString("nickname");

    public final StringPath password = createString("password");

    public final StringPath phone = createString("phone");

    public final StringPath profileImage = createString("profileImage");

    public final EnumPath<com.ottogi.be.member.domain.enums.Role> role = createEnum("role", com.ottogi.be.member.domain.enums.Role.class);

    public final DateTimePath<java.time.LocalDateTime> withdrawnAt = createDateTime("withdrawnAt", java.time.LocalDateTime.class);

    public QMember(String variable) {
        super(Member.class, forVariable(variable));
    }

    public QMember(Path<? extends Member> path) {
        super(path.getType(), path.getMetadata());
    }

    public QMember(PathMetadata metadata) {
        super(Member.class, metadata);
    }

}

