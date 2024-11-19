package com.ottogi.be.dog.exception;

import com.ottogi.be.common.exception.CustomException;

public class CannotDeleteDogException extends CustomException {
    public CannotDeleteDogException() {
        super(DogExceptionConstants.CANNOT_DELETE_DOG);
    }
}
