package com.ottogi.be.member.exception;

import com.ottogi.be.common.exception.CustomException;

public class NicknameDuplicationException extends CustomException {
    public NicknameDuplicationException() {
        super(MemberExceptionConstants.NICKNAME_DUPLICATE);
    }
}
