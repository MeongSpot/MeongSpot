package com.ottogi.be.walking.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QWalkingLog is a Querydsl query type for WalkingLog
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QWalkingLog extends EntityPathBase<WalkingLog> {

    private static final long serialVersionUID = -325262348L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QWalkingLog walkingLog = new QWalkingLog("walkingLog");

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final NumberPath<Double> distance = createNumber("distance", Double.class);

    public final com.ottogi.be.dog.domain.QDog dog;

    public final DateTimePath<java.time.LocalDateTime> finishedAt = createDateTime("finishedAt", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final com.ottogi.be.member.domain.QMember member;

    public final NumberPath<Integer> time = createNumber("time", Integer.class);

    public final StringPath trail = createString("trail");

    public QWalkingLog(String variable) {
        this(WalkingLog.class, forVariable(variable), INITS);
    }

    public QWalkingLog(Path<? extends WalkingLog> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QWalkingLog(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QWalkingLog(PathMetadata metadata, PathInits inits) {
        this(WalkingLog.class, metadata, inits);
    }

    public QWalkingLog(Class<? extends WalkingLog> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.dog = inits.isInitialized("dog") ? new com.ottogi.be.dog.domain.QDog(forProperty("dog"), inits.get("dog")) : null;
        this.member = inits.isInitialized("member") ? new com.ottogi.be.member.domain.QMember(forProperty("member")) : null;
    }

}

