package com.ottogi.be.meeting.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QHashtag is a Querydsl query type for Hashtag
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QHashtag extends EntityPathBase<Hashtag> {

    private static final long serialVersionUID = 2117766785L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QHashtag hashtag = new QHashtag("hashtag");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QMeeting meeting;

    public final StringPath tag = createString("tag");

    public QHashtag(String variable) {
        this(Hashtag.class, forVariable(variable), INITS);
    }

    public QHashtag(Path<? extends Hashtag> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QHashtag(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QHashtag(PathMetadata metadata, PathInits inits) {
        this(Hashtag.class, metadata, inits);
    }

    public QHashtag(Class<? extends Hashtag> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.meeting = inits.isInitialized("meeting") ? new QMeeting(forProperty("meeting"), inits.get("meeting")) : null;
    }

}

