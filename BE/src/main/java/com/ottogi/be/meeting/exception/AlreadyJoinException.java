package com.ottogi.be.meeting.exception;

import com.ottogi.be.common.exception.CustomException;

public class AlreadyJoinException extends CustomException {
    public AlreadyJoinException() { super(MeetingExceptionConstants.ALREADY_JOIN); }
}
