package com.ottogi.be.meeting.validation.annotation;

import com.ottogi.be.meeting.validation.validator.HashtagValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.PARAMETER, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = HashtagValidator.class)
public @interface Hashtag {
    String message() default "모임 해시태그 형식 불일치";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
