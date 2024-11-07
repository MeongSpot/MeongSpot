package com.ottogi.chat.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum MemberExceptionConstants implements ExceptionConstants {

    MEMBER_NOT_FOUND("ME003", "사용자 조회 실패", HttpStatus.BAD_REQUEST);

    final String code;
    final String message;
    final HttpStatus httpStatus;
}
