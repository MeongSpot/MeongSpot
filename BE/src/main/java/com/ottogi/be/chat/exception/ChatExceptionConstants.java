package com.ottogi.be.chat.exception;

import com.ottogi.be.common.exception.ExceptionConstants;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ChatExceptionConstants implements ExceptionConstants {

    CHAT_ROOM_NOT_FOUND("CH000", "채팅방 조회 실패", HttpStatus.BAD_REQUEST);

    final String code;
    final String message;
    final HttpStatus httpStatus;
}
