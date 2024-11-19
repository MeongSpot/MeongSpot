package com.ottogi.be.meeting.exception;

import com.ottogi.be.common.exception.CustomException;

public class MeetingNotFoundException extends CustomException {
    public MeetingNotFoundException() { super(MeetingExceptionConstants.MEETING_NOT_FOUND); }
}
