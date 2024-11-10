package com.ottogi.be.auth.exception;

import com.ottogi.be.common.exception.CustomException;

public class PhoneVerificationFailedException extends CustomException {
    public PhoneVerificationFailedException() {
        super(AuthExceptionConstants.PHONE_AUTH_CODE_MISMATCH);
    }
}
