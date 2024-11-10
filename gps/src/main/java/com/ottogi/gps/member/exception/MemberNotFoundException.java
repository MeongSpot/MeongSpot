package com.ottogi.gps.member.exception;

import com.ottogi.gps.common.exception.CustomException;

public class MemberNotFoundException extends CustomException {
    public MemberNotFoundException() {
        super(MemberExceptionConstants.MEMBER_NOT_FOUND);
    }
}
