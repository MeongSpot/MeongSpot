package com.ottogi.be.meeting.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QMeetingMember is a Querydsl query type for MeetingMember
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMeetingMember extends EntityPathBase<MeetingMember> {

    private static final long serialVersionUID = 1317478314L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QMeetingMember meetingMember = new QMeetingMember("meetingMember");

    public final com.ottogi.be.dog.domain.QDog dog;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final BooleanPath isAlarm = createBoolean("isAlarm");

    public final DateTimePath<java.time.LocalDateTime> joinAt = createDateTime("joinAt", java.time.LocalDateTime.class);

    public final QMeeting meeting;

    public final com.ottogi.be.member.domain.QMember member;

    public QMeetingMember(String variable) {
        this(MeetingMember.class, forVariable(variable), INITS);
    }

    public QMeetingMember(Path<? extends MeetingMember> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QMeetingMember(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QMeetingMember(PathMetadata metadata, PathInits inits) {
        this(MeetingMember.class, metadata, inits);
    }

    public QMeetingMember(Class<? extends MeetingMember> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.dog = inits.isInitialized("dog") ? new com.ottogi.be.dog.domain.QDog(forProperty("dog"), inits.get("dog")) : null;
        this.meeting = inits.isInitialized("meeting") ? new QMeeting(forProperty("meeting"), inits.get("meeting")) : null;
        this.member = inits.isInitialized("member") ? new com.ottogi.be.member.domain.QMember(forProperty("member")) : null;
    }

}

