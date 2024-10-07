package com.um.edu.uy.entities;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.LocalDate;

public class ReleaseDateValidator implements ConstraintValidator<ValidReleaseDate, LocalDate> {

    @Override
    public void initialize(ValidReleaseDate constraintAnnotation) {
    }

    @Override
    public boolean isValid(LocalDate releaseDate, ConstraintValidatorContext context) {
        if (releaseDate == null) {
            return false;
        }

        return !releaseDate.isAfter(LocalDate.now());
    }
}

