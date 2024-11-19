package com.ottogi.be.notification.repository;

import com.ottogi.be.member.domain.Member;
import com.ottogi.be.notification.domain.Notification;
import com.ottogi.be.notification.dto.response.NotificationResponse;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("""
            SELECT new com.ottogi.be.notification.dto.response.NotificationResponse(
                n.id,
                n.type,
                n.sender.profileImage,
                n.content,
                n.createdAt,
                n.isRead,
                n.friendId,
                n.chatRoomId
            ) 
            FROM Notification n 
            WHERE n.receiver = :member AND n.isDeleted = false 
            ORDER BY n.createdAt ASC
            """)
    List<NotificationResponse> findAllByReceiver(@Param("member") Member member);

    boolean existsByReceiverAndIsReadFalse(Member receiver);

}
