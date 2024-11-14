package com.ottogi.be.dog.validation.annotation;

import com.ottogi.be.dog.validation.validator.AgeValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.PARAMETER, ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = AgeValidator.class)
public @interface Age {
    String message() default "반려견 나이 형식 불일치";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
