package com.ottogi.be.dog.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QDog is a Querydsl query type for Dog
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QDog extends EntityPathBase<Dog> {

    private static final long serialVersionUID = -330802480L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QDog dog = new QDog("dog");

    public final NumberPath<Integer> age = createNumber("age", Integer.class);

    public final DatePath<java.time.LocalDate> birth = createDate("birth", java.time.LocalDate.class);

    public final StringPath breed = createString("breed");

    public final EnumPath<com.ottogi.be.dog.domain.enums.Gender> gender = createEnum("gender", com.ottogi.be.dog.domain.enums.Gender.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath introduction = createString("introduction");

    public final BooleanPath isDelete = createBoolean("isDelete");

    public final BooleanPath isNeuter = createBoolean("isNeuter");

    public final com.ottogi.be.member.domain.QMember member;

    public final StringPath name = createString("name");

    public final StringPath profileImage = createString("profileImage");

    public final EnumPath<com.ottogi.be.dog.domain.enums.Size> size = createEnum("size", com.ottogi.be.dog.domain.enums.Size.class);

    public QDog(String variable) {
        this(Dog.class, forVariable(variable), INITS);
    }

    public QDog(Path<? extends Dog> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QDog(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QDog(PathMetadata metadata, PathInits inits) {
        this(Dog.class, metadata, inits);
    }

    public QDog(Class<? extends Dog> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new com.ottogi.be.member.domain.QMember(forProperty("member")) : null;
    }

}

