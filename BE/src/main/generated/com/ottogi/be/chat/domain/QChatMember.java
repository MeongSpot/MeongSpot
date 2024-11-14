package com.ottogi.be.chat.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QChatMember is a Querydsl query type for ChatMember
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QChatMember extends EntityPathBase<ChatMember> {

    private static final long serialVersionUID = -2062539662L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QChatMember chatMember = new QChatMember("chatMember");

    public final QChatRoom chatRoom;

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final DateTimePath<java.time.LocalDateTime> leftAt = createDateTime("leftAt", java.time.LocalDateTime.class);

    public final com.ottogi.be.member.domain.QMember member;

    public final DateTimePath<java.time.LocalDateTime> readAt = createDateTime("readAt", java.time.LocalDateTime.class);

    public QChatMember(String variable) {
        this(ChatMember.class, forVariable(variable), INITS);
    }

    public QChatMember(Path<? extends ChatMember> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QChatMember(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QChatMember(PathMetadata metadata, PathInits inits) {
        this(ChatMember.class, metadata, inits);
    }

    public QChatMember(Class<? extends ChatMember> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.chatRoom = inits.isInitialized("chatRoom") ? new QChatRoom(forProperty("chatRoom")) : null;
        this.member = inits.isInitialized("member") ? new com.ottogi.be.member.domain.QMember(forProperty("member")) : null;
    }

}

