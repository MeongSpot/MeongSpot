package com.ottogi.be.notification.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendInviteNotificationDto {
    private Long notificationId;
    private Boolean accept;
    private String loginId;
}
