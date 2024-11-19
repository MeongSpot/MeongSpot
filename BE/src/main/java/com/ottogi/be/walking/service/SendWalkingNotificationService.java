package com.ottogi.be.walking.service;

import com.ottogi.be.common.constants.RedisFieldConstants;
import com.ottogi.be.common.constants.RedisKeyConstants;
import com.ottogi.be.common.infra.RedisService;
import com.ottogi.be.friend.domain.Friend;
import com.ottogi.be.friend.repository.FriendRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.notification.domain.Notification;
import com.ottogi.be.notification.domain.enums.Type;
import com.ottogi.be.notification.repository.NotificationRepository;
import com.ottogi.be.notification.service.SendNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
@Slf4j
@RequiredArgsConstructor
public class SendWalkingNotificationService {
    private final RedisService redisService;
    private final NotificationRepository notificationRepository;
    private final SendNotificationService sendNotificationService;
    private final FriendRepository friendRepository;

    public void sendWalkingNotification(Member member) throws ExecutionException, InterruptedException {
        List<Member> friends = friendRepository.findAllFriends(member);

        for (Member friend : friends) {
            String fcmToken = (String) redisService.getHashData(RedisKeyConstants.TOKEN + friend.getLoginId(), RedisFieldConstants.FCM);
            if (fcmToken != null) {
                Notification notification = Notification.builder()
                        .sender(member)
                        .receiver(friend)
                        .content(member.getNickname() + "이 산책을 시작하셨습니다.")
                        .type(Type.WALKING)
                        .isDeleted(false)
                        .isRead(false)
                        .build();
                notificationRepository.save(notification);

                String message = member.getNickname() + "이 산책을 시작하셨습니다.";
                sendNotificationService.sendNotification(fcmToken, "산책 알림", message);
            } else {
                log.warn("사용자 {}의 FCM 토큰이 없습니다.", friend.getNickname());
            }

        }
    }


}
