package com.ottogi.be.notification.exception;

import com.ottogi.be.common.exception.ExceptionConstants;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum NotificationExceptionConstants implements ExceptionConstants {
    NOTIFICATION_NOT_FOUND("NO000", "알림 조회 실패", HttpStatus.BAD_REQUEST),
    FRIEND_INVITATION_NOT_FOUND("NO002", "친구 초대 알림 조회 실패", HttpStatus.BAD_REQUEST),
    FCM_TOKEN_NOT_FOUND("NO003","FCM 토큰 조회 실패",HttpStatus.BAD_REQUEST);

    final String code;
    final String message;
    final HttpStatus httpStatus;
}
