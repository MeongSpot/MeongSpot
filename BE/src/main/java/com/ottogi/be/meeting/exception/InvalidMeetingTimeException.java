package com.ottogi.be.meeting.exception;

import com.ottogi.be.common.exception.CustomException;

public class InvalidMeetingTimeException extends CustomException {
    public InvalidMeetingTimeException() {
        super(MeetingExceptionConstants.INVALID_MEETING_TIME);
    }
}
