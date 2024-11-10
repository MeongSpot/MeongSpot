package com.ottogi.be.friend.exception;

import com.ottogi.be.common.exception.ExceptionConstants;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum FriendExceptionConstants implements ExceptionConstants {

    FRIEND_RELATIONSHIP_NOT_FOUND("FR000", "친구 관계 조회 실패", HttpStatus.BAD_REQUEST);

    final String code;
    final String message;
    final HttpStatus httpStatus;
}
