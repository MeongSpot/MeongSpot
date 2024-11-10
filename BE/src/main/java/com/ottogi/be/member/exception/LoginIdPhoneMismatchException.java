package com.ottogi.be.member.exception;

import com.ottogi.be.common.exception.CustomException;

public class LoginIdPhoneMismatchException extends CustomException {
    public LoginIdPhoneMismatchException() {
        super(MemberExceptionConstants.LOGIN_ID_PHONE_MISMATCH);
    }
}
