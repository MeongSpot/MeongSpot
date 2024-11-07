package com.ottogi.chat.exception;

import lombok.Getter;

@Getter
public class CustomException extends RuntimeException {
    private final ExceptionConstants constants;

    public CustomException(ExceptionConstants constants) {
        this.constants = constants;
    }
}
