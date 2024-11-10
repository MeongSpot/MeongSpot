package com.ottogi.be.auth.exception;

import com.ottogi.be.common.exception.CustomException;

public class PhoneVerificationNotCompletedException extends CustomException {
    public PhoneVerificationNotCompletedException() {
        super(AuthExceptionConstants.PHONE_VERIFICATION_NOT_COMPLETED);
    }
}
