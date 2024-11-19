package com.ottogi.be.notification.domain;

import com.ottogi.be.notification.domain.enums.Status;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
public class NotificationFriendInvite extends Notification {

    @Enumerated(EnumType.STRING)
    private Status status;

    public void accept() {
        this.status = Status.ACCEPT;
    }

    public void reject() {
        this.status = Status.REJECT;
    }

    @PreRemove
    public void preRemove() {
        this.delete();
    }

}
