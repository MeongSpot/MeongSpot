package com.ottogi.be.dog.exception;

import com.ottogi.be.common.exception.CustomException;
import com.ottogi.be.common.exception.ExceptionConstants;

public class DogImageUploadException extends CustomException {
    public DogImageUploadException() {
        super(DogExceptionConstants.DOG_IMAGE_UPLOAD);
    }
}
