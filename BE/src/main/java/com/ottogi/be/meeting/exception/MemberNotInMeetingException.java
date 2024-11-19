package com.ottogi.be.meeting.exception;

import com.ottogi.be.common.exception.CustomException;

public class MemberNotInMeetingException extends CustomException {
    public MemberNotInMeetingException() {super(MeetingExceptionConstants.MEMBER_NOT_IN_MEETING);}
}
