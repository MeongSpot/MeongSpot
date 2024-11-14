package com.ottogi.gps.member.validation.validator;

import com.ottogi.gps.member.validation.annotation.Nickname;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class NicknameValidator implements ConstraintValidator<Nickname, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        if (value == null || value.isEmpty()) {
            return false;
        }

        String regex = "^(?:[a-zA-Z]{2,8}|[가-힣]{2,8}|[a-zA-Z0-9가-힣]{2,8})$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(value);

        return matcher.matches();
    }
}