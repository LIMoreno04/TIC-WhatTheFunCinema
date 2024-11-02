package com.um.edu.uy.entities.validators;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.ConstraintValidator;

public class PasswordValidator implements ConstraintValidator<ValidPassword, String> {

    @Override
    public boolean isValid(String password, ConstraintValidatorContext context) {
        if (password == null) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("La contraseña no puede ser vacía. Debe tener al menos 8 caracteres, una mayúscula, una minúscula, y un símbolo especial.")
                    .addConstraintViolation();
            return false;
        }

        if (password.length() < 8) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("La contraseña debe tener al menos 8 caracteres.")
                    .addConstraintViolation();
            return false;
        }

        boolean hasUppercase = false;
        boolean hasLowercase = false;
        boolean hasDigit = false;
        boolean hasSpecialChar = false;

        for (char c : password.toCharArray()) {
            if (Character.isUpperCase(c)) hasUppercase = true;
            else if (Character.isLowerCase(c)) hasLowercase = true;
            else if (Character.isDigit(c)) hasDigit = true;
            else if (!Character.isLetterOrDigit(c)) hasSpecialChar = true;
        }

        if (!hasUppercase) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("La contraseña debe contener al menos una mayúscula.")
                    .addConstraintViolation();
            return false;
        }

        if (!hasLowercase) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("La contraseña debe contener al menos una minúscula.")
                    .addConstraintViolation();
            return false;
        }

        if (!hasDigit) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("La contraseña debe contener al menos un número.")
                    .addConstraintViolation();
            return false;
        }

        if (!hasSpecialChar) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate("La contraseña debe contener al menos un símbolo especial (@~$-,.+- etc).")
                    .addConstraintViolation();
            return false;
        }

        return true;
    }
}

