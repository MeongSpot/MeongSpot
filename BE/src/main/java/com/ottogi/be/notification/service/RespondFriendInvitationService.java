package com.ottogi.be.notification.service;

import com.ottogi.be.common.constants.RedisFieldConstants;
import com.ottogi.be.common.constants.RedisKeyConstants;
import com.ottogi.be.common.infra.RedisService;
import com.ottogi.be.friend.domain.Friend;
import com.ottogi.be.friend.exception.AlreadyFriendException;
import com.ottogi.be.friend.repository.FriendRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.notification.domain.Notification;
import com.ottogi.be.notification.domain.NotificationFriendInvite;
import com.ottogi.be.notification.domain.enums.Status;
import com.ottogi.be.notification.domain.enums.Type;
import com.ottogi.be.notification.dto.FriendInviteNotificationDto;
import com.ottogi.be.notification.exception.FcmTokenNotFoundException;
import com.ottogi.be.notification.repository.NotificationFriendInviteRepository;
import com.ottogi.be.notification.exception.FriendInvitationNotFoundException;
import com.ottogi.be.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.ExecutionException;

@Service
@Slf4j
@RequiredArgsConstructor
public class RespondFriendInvitationService {
    private final NotificationFriendInviteRepository friendInviteRepository;
    private final FriendRepository friendRepository;
    private final NotificationRepository notificationRepository;
    private final RedisService redisService;
    private final SendNotificationService sendNotificationService;

    @Transactional
    public void respondFriendInvitation(FriendInviteNotificationDto dto){
        NotificationFriendInvite notificationInvite = friendInviteRepository.findById(dto.getNotificationId())
                .orElseThrow(FriendInvitationNotFoundException::new);

        Member sender = notificationInvite.getSender();
        Member receiver = notificationInvite.getReceiver();

        if (dto.getAccept() != null && dto.getAccept()){
            if (friendRepository.existsBySenderAndReceiver(sender, receiver) ||
                    friendRepository.existsBySenderAndReceiver(receiver, sender)) {
                throw new AlreadyFriendException();
            }
            notificationInvite.accept();

            Friend friend = Friend.builder()
                    .sender(sender)
                    .receiver(receiver)
                    .build();

            friendRepository.save(friend);
            Notification notification = Notification.builder()
                    .sender(receiver)
                    .receiver(sender)
                    .content(receiver.getNickname() + "이 친구요청을 수락하였습니다.")
                    .type(Type.FRIEND_ACCEPT)
                    .isDeleted(false)
                    .isRead(false)
                    .build();
            notificationRepository.save(notification);

            String fcmToken = (String) redisService.getHashData(RedisKeyConstants.TOKEN+sender.getLoginId(), RedisFieldConstants.FCM);
            if(fcmToken != null){
                String message = receiver.getNickname() + "이 친구요청을 수락하였습니다.";
                sendNotificationService.sendNotification(fcmToken, "친구 초대 응답", message);
            }else{
                log.warn("사용자 {}의 FCM 토큰이 없습니다.", sender.getNickname());
            }
        } else {
            notificationInvite.reject();
        }
        friendInviteRepository.save(notificationInvite);
        notificationInvite.delete();

    }
}

