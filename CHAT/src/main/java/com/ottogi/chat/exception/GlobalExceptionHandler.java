package com.ottogi.chat.exception;

import com.ottogi.chat.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleException(Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    @ExceptionHandler(CustomException.class)
    public ResponseEntity<?> customExceptionHandler(CustomException e) {
        ExceptionConstants ec = e.getConstants();
        return new ResponseEntity<>(new ApiResponse<>(ec.getCode(), ec.getMessage(), null), ec.getHttpStatus());
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<?> handlerMethodValidationException(HandlerMethodValidationException e) {
        return new ResponseEntity<>(new ApiResponse<>("CN000", "유효성 검사 실패", null), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> methodArgumentNotValidExceptionHandler(MethodArgumentNotValidException e) {
        return new ResponseEntity<>(new ApiResponse<>("CN000", "유효성 검사 실패", null), HttpStatus.BAD_REQUEST);
    }
}