package com.ottogi.be.friend.exception;

import com.ottogi.be.common.exception.CustomException;

public class FriendRelationShipNotFoundException extends CustomException {
    public FriendRelationShipNotFoundException() {
        super(FriendExceptionConstants.FRIEND_RELATIONSHIP_NOT_FOUND);
    }
}
