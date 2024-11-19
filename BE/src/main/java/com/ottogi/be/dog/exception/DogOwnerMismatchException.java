package com.ottogi.be.dog.exception;

import com.ottogi.be.common.exception.CustomException;

public class DogOwnerMismatchException extends CustomException {
    public DogOwnerMismatchException() {super(DogExceptionConstants.DOG_OWNER_MISMATCH);}
}
