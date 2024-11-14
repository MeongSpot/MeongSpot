package com.ottogi.gps.auth.exception;

import com.ottogi.gps.common.exception.CustomException;

public class PhoneVerificationNotCompletedException extends CustomException {
    public PhoneVerificationNotCompletedException() {
        super(AuthExceptionConstants.PHONE_VERIFICATION_NOT_COMPLETED);
    }
}
