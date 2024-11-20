package com.ottogi.be.meeting.service;

import com.ottogi.be.common.constants.RedisFieldConstants;
import com.ottogi.be.common.constants.RedisKeyConstants;
import com.ottogi.be.common.infra.RedisService;
import com.ottogi.be.meeting.domain.Meeting;
import com.ottogi.be.meeting.repository.MeetingMemberRepository;
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
public class SendJoinNotificationService{

    private final MeetingMemberRepository meetingMemberRepository;
    private final RedisService redisService;
    private final NotificationRepository notificationRepository;
    private final SendNotificationService sendNotificationService;

    public void sendMeetingJoinNotification(Meeting meeting, Member newMember){
        List<Member> receivers = meetingMemberRepository.findMembersForNotification(meeting, newMember);

        for (Member receiver : receivers) {
            String fcmToken = (String) redisService.getHashData(RedisKeyConstants.TOKEN+receiver.getLoginId(), RedisFieldConstants.FCM);
            if(fcmToken != null){
                Notification notification = Notification.builder()
                        .sender(newMember)
                        .receiver(receiver)
                        .content(newMember.getNickname() + "이 모임에 참가하셨습니다.")
                        .type(Type.MEETING_JOIN)
                        .isDeleted(false)
                        .isRead(false)
                        .build();
                notificationRepository.save(notification);

                String message = newMember.getNickname() + "이 모임에 참가하셨습니다.";
                sendNotificationService.sendNotification(fcmToken, "모임 참가", message);
            }else{
                log.warn("사용자 {}의 FCM 토큰이 없습니다.", receiver.getNickname());
            }
        }
    }
}


