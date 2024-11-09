package com.ottogi.be.notification.service;

import com.ottogi.be.friend.domain.Friend;
import com.ottogi.be.friend.exception.AlreadyFriendException;
import com.ottogi.be.friend.repository.FriendRepository;
import com.ottogi.be.member.domain.Member;
import com.ottogi.be.notification.domain.NotificationFriendInvite;
import com.ottogi.be.notification.dto.FriendInviteNotificationDto;
import com.ottogi.be.notification.repository.NotificationFriendInviteRepository;
import com.ottogi.be.notification.exception.FriendInvitationNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class RespondFriendInvitationService {
    private final NotificationFriendInviteRepository friendInviteRepository;
    private final FriendRepository friendRepository;
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
        } else {
            notificationInvite.reject();
        }
        friendInviteRepository.save(notificationInvite);
        notificationInvite.delete();
    }


}

