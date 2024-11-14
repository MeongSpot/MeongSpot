package com.ottogi.be.notification.repository;

import com.ottogi.be.member.domain.Member;
import com.ottogi.be.notification.domain.NotificationFriendInvite;
import com.ottogi.be.notification.domain.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationFriendInviteRepository extends JpaRepository<NotificationFriendInvite, Long> {
    boolean existsBySenderAndReceiverAndStatus(Member sender, Member receiver, Status status);

}
