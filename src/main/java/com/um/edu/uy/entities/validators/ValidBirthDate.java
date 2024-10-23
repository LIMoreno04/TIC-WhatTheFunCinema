package com.um.edu.uy.entities.validators;
import jakarta.validation.Constraint;

import jakarta.validation.Payload;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = BirthDateValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidBirthDate {
    String message() default "El ususario debe ser mayor de 18 años.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

