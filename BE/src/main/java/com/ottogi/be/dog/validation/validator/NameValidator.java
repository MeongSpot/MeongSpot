package com.ottogi.be.dog.validation.validator;

import com.ottogi.be.dog.validation.annotation.Name;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class NameValidator implements ConstraintValidator<Name, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        if (value == null || value.isEmpty()) {
            return false;
        }

        if (value.length() < 1 || value.length() > 16) {
            return false;
        }

        String regex = "^[가-힣a-zA-Z]*$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(value);

        return matcher.matches();
    }
}
