package com.ottogi.chat.exception;

public class MemberNotFoundException extends CustomException {
    public MemberNotFoundException() {
        super(MemberExceptionConstants.MEMBER_NOT_FOUND);
    }
}
