package com.ottogi.be.member.exception;

import com.ottogi.be.common.exception.CustomException;

public class MemberNotFoundException extends CustomException {
    public MemberNotFoundException() {
        super(MemberExceptionConstants.MEMBER_NOT_FOUND);
    }
}
