package com.ottogi.be.walking.exception;

import com.ottogi.be.common.exception.CustomException;

public class WalkingLogNotFoundException extends CustomException {
    public WalkingLogNotFoundException() {
        super(WalkingExceptionConstants.WALKING_LOG_NOT_FOUND);
    }
}

