package com.ottogi.be.meeting.validation.validator;

import com.ottogi.be.meeting.validation.annotation.Hashtag;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.List;

public class HashtagValidator implements ConstraintValidator<Hashtag, List<String>> {
    @Override
    public boolean isValid(List<String> value, ConstraintValidatorContext constraintValidatorContext) {
        if (value == null || value.isEmpty()) {
            return true;
        }

        if (value.size() > 5) {
            return false;
        }

        for (String tag : value) {
            if (tag.length() > 16 || tag.contains(" ")) {
                return false;
            }
        }

        return true;
    }
}
