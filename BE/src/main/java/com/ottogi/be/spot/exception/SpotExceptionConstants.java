package com.ottogi.be.spot.exception;

import com.ottogi.be.common.exception.ExceptionConstants;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum SpotExceptionConstants implements ExceptionConstants {

    SPOT_NOT_FOUND("MP000", "모임 장소 조회 실패", HttpStatus.BAD_REQUEST),;

    final String code;
    final String message;
    final HttpStatus httpStatus;
}
