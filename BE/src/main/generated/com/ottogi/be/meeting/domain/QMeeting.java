package com.ottogi.be.meeting.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QMeeting is a Querydsl query type for Meeting
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMeeting extends EntityPathBase<Meeting> {

    private static final long serialVersionUID = -1932714768L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QMeeting meeting = new QMeeting("meeting");

    public final com.ottogi.be.chat.domain.QChatRoom chatRoom;

    public final DateTimePath<java.time.LocalDateTime> createdAt = createDateTime("createdAt", java.time.LocalDateTime.class);

    public final StringPath detailLocation = createString("detailLocation");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath information = createString("information");

    public final BooleanPath isDone = createBoolean("isDone");

    public final NumberPath<Integer> maxParticipants = createNumber("maxParticipants", Integer.class);

    public final DateTimePath<java.time.LocalDateTime> meetingAt = createDateTime("meetingAt", java.time.LocalDateTime.class);

    public final NumberPath<Integer> participants = createNumber("participants", Integer.class);

    public final com.ottogi.be.spot.domain.QSpot spot;

    public final StringPath title = createString("title");

    public QMeeting(String variable) {
        this(Meeting.class, forVariable(variable), INITS);
    }

    public QMeeting(Path<? extends Meeting> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QMeeting(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QMeeting(PathMetadata metadata, PathInits inits) {
        this(Meeting.class, metadata, inits);
    }

    public QMeeting(Class<? extends Meeting> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.chatRoom = inits.isInitialized("chatRoom") ? new com.ottogi.be.chat.domain.QChatRoom(forProperty("chatRoom")) : null;
        this.spot = inits.isInitialized("spot") ? new com.ottogi.be.spot.domain.QSpot(forProperty("spot")) : null;
    }

}

