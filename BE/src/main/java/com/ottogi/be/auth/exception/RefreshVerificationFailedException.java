package com.ottogi.be.auth.exception;

import com.ottogi.be.common.exception.CustomException;

public class RefreshVerificationFailedException extends CustomException {
    public RefreshVerificationFailedException() {
        super(AuthExceptionConstants.REFRESH_VERIFICATION_FAILED);
    }
}
