package com.ottogi.be.notification.dto.response;

import com.ottogi.be.notification.domain.enums.Type;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class NotificationResponse {
    private Long notificationId;
    private Type type;
    private String profileImage;
    private String content;
    private LocalDateTime createdAt;
    private Boolean isRead;

    private Long friendId;
    private Long chatRoomId;
}
