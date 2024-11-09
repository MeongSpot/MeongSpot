package com.ottogi.be.friend.exception;

import com.ottogi.be.common.exception.CustomException;

public class AlreadyInvitationException extends CustomException {
  public AlreadyInvitationException() {
    super(FriendExceptionConstants.ALREADY_INVITATION);
  }
}
