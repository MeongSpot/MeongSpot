package com.ottogi.be.member.validation.validator;

import com.ottogi.be.member.validation.annotation.Name;
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

        String koreanRegex = "^[가-힣]{2,16}$";
        Pattern koreanPattern = Pattern.compile(koreanRegex);
        Matcher koreanMatcher = koreanPattern.matcher(value);

        String englishRegex = "^[a-zA-Z]{2,16}$";
        Pattern englishPattern = Pattern.compile(englishRegex);
        Matcher englishMatcher = englishPattern.matcher(value);

        return koreanMatcher.matches() || englishMatcher.matches();
    }
}