package com.ottogi.be.member.exception;

import com.ottogi.be.common.exception.CustomException;

public class PhoneDuplicationException extends CustomException {

    public PhoneDuplicationException() {
        super(MemberExceptionConstants.PHONE_DUPLICATE);
    }
}
