package com.ottogi.be.friend.exception;

import com.ottogi.be.common.exception.CustomException;

public class AlreadyFriendException extends CustomException {
    public AlreadyFriendException() {
        super(FriendExceptionConstants.ALREADY_FRIEND);
    }
}
