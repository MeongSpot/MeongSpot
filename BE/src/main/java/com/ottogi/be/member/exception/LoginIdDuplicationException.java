package com.ottogi.be.member.exception;

import com.ottogi.be.common.exception.CustomException;

public class LoginIdDuplicationException extends CustomException {

    public LoginIdDuplicationException() {
        super(MemberExceptionConstants.LOGIN_ID_DUPLICATE);
    }
}
