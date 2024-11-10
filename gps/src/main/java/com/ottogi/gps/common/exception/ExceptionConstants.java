package com.ottogi.gps.common.exception;

import org.springframework.http.HttpStatus;

public interface ExceptionConstants {
    String getCode();
    String getMessage();
    HttpStatus getHttpStatus();
}
