package com.ottogi.be.meeting.exception;

import com.ottogi.be.common.exception.ExceptionConstants;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum MeetingExceptionConstants implements ExceptionConstants {

    INVALID_MEETING_TIME("MT000", "유효하지 않은 모임 시간", HttpStatus.BAD_REQUEST);

    final String code;
    final String message;
    final HttpStatus httpStatus;

}
