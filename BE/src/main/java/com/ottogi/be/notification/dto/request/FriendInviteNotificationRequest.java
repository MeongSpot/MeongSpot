package com.ottogi.be.notification.dto.request;

import com.ottogi.be.notification.dto.FriendInviteNotificationDto;
import lombok.*;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendInviteNotificationRequest {
    private Boolean accept;
    private Long notificationId;

    public FriendInviteNotificationDto toDto(String loginId){
        return FriendInviteNotificationDto.builder()
                .notificationId(this.notificationId)
                .loginId(loginId)
                .accept(this.accept)
                .build();
    }
}
