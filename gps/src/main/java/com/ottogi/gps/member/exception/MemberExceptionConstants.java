package com.ottogi.gps.member.exception;

import com.ottogi.gps.common.exception.ExceptionConstants;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum MemberExceptionConstants implements ExceptionConstants {

    MEMBER_NOT_FOUND("ME003", "사용자 조회 실패", HttpStatus.BAD_REQUEST),
    LOGIN_ID_PHONE_MISMATCH("ME004", "로그인 아이디 전화번호 불일치", HttpStatus.BAD_REQUEST);

    final String code;
    final String message;
    final HttpStatus httpStatus;
}
