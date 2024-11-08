package com.ottogi.be.notification.exception;

import com.ottogi.be.common.exception.CustomException;
import com.ottogi.be.member.exception.MemberExceptionConstants;

public class NotificationNotFoundException extends CustomException {
    public NotificationNotFoundException() {
        super(NotificationExceptionConstants.NOTIFICATION_NOT_FOUND);
    }
}
