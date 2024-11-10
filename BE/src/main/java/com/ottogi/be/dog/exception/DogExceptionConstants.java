package com.ottogi.be.dog.exception;

import com.ottogi.be.common.exception.ExceptionConstants;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum DogExceptionConstants implements ExceptionConstants {
    DOG_IMAGE_UPLOAD("DO000", "반려견 사진 업로드 실패", HttpStatus.BAD_REQUEST),
    DOG_PERSONALITY_NOT_FOUND("DO001", "반려견 성격 조회 실패", HttpStatus.BAD_REQUEST),
    DOG_NOT_FOUND("DO002", "반려견 조회 실패", HttpStatus.BAD_REQUEST),
    DOG_OWNER_MISMATCH("DO003", "반려견, 주인 매칭 실패", HttpStatus.BAD_REQUEST);

    final String code;
    final String message;
    final HttpStatus httpStatus;

}