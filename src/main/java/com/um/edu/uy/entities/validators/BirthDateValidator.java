package com.um.edu.uy.entities.validators;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.time.LocalDate;
import java.time.Period;

public class BirthDateValidator implements ConstraintValidator<ValidBirthDate, LocalDate> {

    @Override
    public boolean isValid(LocalDate birthdate, ConstraintValidatorContext context) {
        if (birthdate == null) {
            return false; // O manejar el caso de nulo de otra manera según tus requisitos
        }
        return Period.between(birthdate, LocalDate.now()).getYears() >= 18;
    }
}

