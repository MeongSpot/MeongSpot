package com.ottogi.be.friend.service;

import com.ottogi.be.common.constants.RedisFieldConstants;
import com.ottogi.be.common.constants.RedisKeyConstants;
import com.ottogi.be.common.infra.RedisService;
import com.ottogi.be.friend.dto.FriendInvitationDto;
import com.ottogi.be.friend.exception.AlreadyFriendException;
import com.ottogi.be.friend.exception.AlreadyInvitationException;
import com.ottogi.be.friend.repository.FriendRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.member.exception.MemberNotFoundException;
import com.ottogi.be.member.repository.MemberRepository;
import com.ottogi.be.notification.domain.NotificationFriendInvite;
import com.ottogi.be.notification.domain.enums.Status;
import com.ottogi.be.notification.domain.enums.Type;
import com.ottogi.be.notification.repository.NotificationFriendInviteRepository;
import com.ottogi.be.notification.service.SendNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.concurrent.ExecutionException;

@Slf4j
@Service
@RequiredArgsConstructor
public class InviteFriendService {
    private  final FriendRepository friendRepository;
    private final MemberRepository memberRepository;
    private final RedisService redisService;
    private final SendNotificationService sendNotificationService;
    private final NotificationFriendInviteRepository notificationFriendInviteRepository;

    @Transactional
    public void inviteFriend(FriendInvitationDto request){
        Member member = memberRepository.findByLoginId(request.getLoginId())
                .orElseThrow(MemberNotFoundException::new);

        Member receiver = memberRepository.findById(request.getReceiverId())
                .orElseThrow(MemberNotFoundException::new);

        if (friendRepository.existsBySenderAndReceiver(member, receiver) ||
                friendRepository.existsBySenderAndReceiver(receiver, member)) {
            throw new AlreadyFriendException();
        }
        if (notificationFriendInviteRepository.existsBySenderAndReceiverAndStatus(member, receiver, Status.WAIT)) {throw new AlreadyInvitationException();}

        NotificationFriendInvite notification = NotificationFriendInvite.builder()
                .sender(member)
                .receiver(receiver)
                .content(member.getNickname() + "이 친구요청을 하였습니다.")
                .type(Type.FRIEND_INVITE)
                .status(Status.WAIT)
                .isDeleted(false)
                .friendId(member.getId())
                .isRead(false)
                .build();
        notificationFriendInviteRepository.save(notification);

        String fcmToken = (String) redisService.getHashData(RedisKeyConstants.TOKEN+receiver.getLoginId(), RedisFieldConstants.FCM);
        if(fcmToken != null){
            String message = member.getNickname() + "이 친구요청을 하였습니다.";
            sendNotificationService.sendNotification(fcmToken, "친구 초대", message);
        }else{
            log.warn("사용자 {}의 FCM 토큰이 없습니다.", receiver.getNickname());
        }
    }
}
