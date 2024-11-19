package com.ottogi.gps.auth.exception;

import com.ottogi.gps.common.exception.CustomException;

public class PhoneVerificationFailedException extends CustomException {
    public PhoneVerificationFailedException() {
        super(AuthExceptionConstants.PHONE_AUTH_CODE_MISMATCH);
    }
}
