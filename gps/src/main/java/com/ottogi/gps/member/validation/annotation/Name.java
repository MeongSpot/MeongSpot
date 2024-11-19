package com.ottogi.gps.member.validation.annotation;

import com.ottogi.gps.member.validation.validator.NameValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.PARAMETER, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = NameValidator.class)
public @interface Name {
    String message() default "이름 형식 불일치";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
