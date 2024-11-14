package com.ottogi.be.dog.exception;

import com.ottogi.be.common.exception.CustomException;

public class DogPersonalityNotFoundException extends CustomException {
    public DogPersonalityNotFoundException() {
        super(DogExceptionConstants.DOG_PERSONALITY_NOT_FOUND);
    }
}
