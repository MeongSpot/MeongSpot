package com.ottogi.be.chat.exception;

import com.ottogi.be.common.exception.CustomException;

public class ChatRoomNotFoundException extends CustomException {
    public ChatRoomNotFoundException() {
        super(ChatExceptionConstants.CHAT_ROOM_NOT_FOUND);
    }
}
