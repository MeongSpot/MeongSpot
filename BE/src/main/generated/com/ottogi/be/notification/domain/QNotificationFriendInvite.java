package com.ottogi.be.notification.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QNotificationFriendInvite is a Querydsl query type for NotificationFriendInvite
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QNotificationFriendInvite extends EntityPathBase<NotificationFriendInvite> {

    private static final long serialVersionUID = -645325371L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QNotificationFriendInvite notificationFriendInvite = new QNotificationFriendInvite("notificationFriendInvite");

    public final QNotification _super;

    //inherited
    public final NumberPath<Long> chatRoomId;

    //inherited
    public final StringPath content;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdAt;

    //inherited
    public final NumberPath<Long> friendId;

    //inherited
    public final NumberPath<Long> id;

    //inherited
    public final BooleanPath isDeleted;

    //inherited
    public final BooleanPath isRead;

    // inherited
    public final com.ottogi.be.member.domain.QMember receiver;

    // inherited
    public final com.ottogi.be.member.domain.QMember sender;

    public final EnumPath<com.ottogi.be.notification.domain.enums.Status> status = createEnum("status", com.ottogi.be.notification.domain.enums.Status.class);

    //inherited
    public final EnumPath<com.ottogi.be.notification.domain.enums.Type> type;

    public QNotificationFriendInvite(String variable) {
        this(NotificationFriendInvite.class, forVariable(variable), INITS);
    }

    public QNotificationFriendInvite(Path<? extends NotificationFriendInvite> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QNotificationFriendInvite(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QNotificationFriendInvite(PathMetadata metadata, PathInits inits) {
        this(NotificationFriendInvite.class, metadata, inits);
    }

    public QNotificationFriendInvite(Class<? extends NotificationFriendInvite> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this._super = new QNotification(type, metadata, inits);
        this.chatRoomId = _super.chatRoomId;
        this.content = _super.content;
        this.createdAt = _super.createdAt;
        this.friendId = _super.friendId;
        this.id = _super.id;
        this.isDeleted = _super.isDeleted;
        this.isRead = _super.isRead;
        this.receiver = _super.receiver;
        this.sender = _super.sender;
        this.type = _super.type;
    }

}

