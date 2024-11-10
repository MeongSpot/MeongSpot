package com.ottogi.be.common.exception;

import org.springframework.http.HttpStatus;

public interface ExceptionConstants {
    String getCode();
    String getMessage();
    HttpStatus getHttpStatus();
}
