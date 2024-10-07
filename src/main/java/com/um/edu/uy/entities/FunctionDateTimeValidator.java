package com.um.edu.uy.entities;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.LocalDateTime;

public class FunctionDateTimeValidator implements ConstraintValidator<ValidFunctionDateTime, LocalDateTime> {

    @Override
    public void initialize(ValidFunctionDateTime constraintAnnotation) {
    }

    @Override
    public boolean isValid(LocalDateTime functionDateTime, ConstraintValidatorContext context) {
        if (functionDateTime == null) {
            return false;
        }

        return !functionDateTime.isBefore(LocalDateTime.now());
    }
}

