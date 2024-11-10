package com.ottogi.gps.auth.exception;

import com.ottogi.gps.common.exception.CustomException;

public class RefreshVerificationFailedException extends CustomException {
    public RefreshVerificationFailedException() {
        super(AuthExceptionConstants.REFRESH_VERIFICATION_FAILED);
    }
}
