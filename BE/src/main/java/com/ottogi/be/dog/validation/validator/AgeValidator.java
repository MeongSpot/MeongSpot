package com.ottogi.be.dog.validation.validator;

import com.ottogi.be.dog.validation.annotation.Age;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class AgeValidator implements ConstraintValidator<Age, Integer> {
    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext constraintValidatorContext) {
        if (value == null) {
            return false;
        }
        return value>=0 && value<=30;
    }
}
