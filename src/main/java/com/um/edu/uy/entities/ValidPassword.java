package com.um.edu.uy.entities;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
@Constraint (validatedBy = PasswordValidator.class)
@Target({ ElementType.FIELD, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPassword {
    String message() default "Password must be at least 8 characters long, contain letters and digits.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

