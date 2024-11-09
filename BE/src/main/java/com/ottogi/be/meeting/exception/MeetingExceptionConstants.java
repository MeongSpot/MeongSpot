package com.ottogi.be.meeting.exception;

import com.ottogi.be.common.exception.ExceptionConstants;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum MeetingExceptionConstants implements ExceptionConstants {

    INVALID_MEETING_TIME("MT000", "유효하지 않은 모임 시간", HttpStatus.BAD_REQUEST),
    MEETING_NOT_FOUND("MT001", "모임 조회 실패", HttpStatus.BAD_REQUEST),
    OVER_MAX_PARTICIPANTS("MT002", "모임 최대 인원 초과", HttpStatus.BAD_REQUEST),
    ALREADY_JOIN("MT103", "이미 참여한 멤버", HttpStatus.BAD_REQUEST),;

    final String code;
    final String message;
    final HttpStatus httpStatus;

}
