package com.ottogi.be.notification.exception;

import com.ottogi.be.common.exception.CustomException;

public class FriendInvitationNotFoundException extends CustomException {
  public FriendInvitationNotFoundException() {
    super(NotificationExceptionConstants.FRIEND_INVITATION_NOT_FOUND);
  }
}
