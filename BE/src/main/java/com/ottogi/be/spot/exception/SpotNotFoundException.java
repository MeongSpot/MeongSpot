package com.ottogi.be.spot.exception;

import com.ottogi.be.common.exception.CustomException;

public class SpotNotFoundException extends CustomException {
    public SpotNotFoundException() {
        super(SpotExceptionConstants.SPOT_NOT_FOUND);
    }
}
