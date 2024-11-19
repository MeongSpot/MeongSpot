package com.ottogi.be.meeting.exception;

import com.ottogi.be.common.exception.CustomException;

public class OverMaxParticipantsException extends CustomException {
    public OverMaxParticipantsException() { super(MeetingExceptionConstants.OVER_MAX_PARTICIPANTS); }
}
