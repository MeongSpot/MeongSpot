package com.ottogi.be.notification.exception;

import com.ottogi.be.common.exception.CustomException;

public class FcmTokenNotFoundException extends CustomException {
    public FcmTokenNotFoundException() {
        super(NotificationExceptionConstants.FCM_TOKEN_NOT_FOUND);
    }

}
