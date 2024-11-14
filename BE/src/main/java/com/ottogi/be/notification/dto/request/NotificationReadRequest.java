package com.ottogi.be.notification.dto.request;

import com.ottogi.be.notification.dto.NotificationDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class NotificationReadRequest {
    private Long notificationId;

    public NotificationDto toDto(String loginId){
        return NotificationDto.builder()
                .notificationId(this.notificationId)
                .loginId(loginId)
                .build();
    }

}
