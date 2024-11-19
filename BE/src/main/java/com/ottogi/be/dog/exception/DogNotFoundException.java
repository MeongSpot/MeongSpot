package com.ottogi.be.dog.exception;

import com.ottogi.be.common.exception.CustomException;

public class DogNotFoundException extends CustomException {
    public DogNotFoundException() {super(DogExceptionConstants.DOG_NOT_FOUND);}
}
