package com.um.edu.uy.entities.validators;

import java.time.LocalDate;
import java.time.Period;

public class FieldValidation {

    public static int minimumAge = 12;
    public static boolean isPasswordValid(String password) {  //buscar validator de spreen.
        if (password != null) {
            if (password.length() < 8) {
                return false;
            }
            boolean hasLetter = false;
            boolean hasDigit = false;

            for (char c : password.toCharArray()) {
                if (Character.isLetter(c)) {
                    hasLetter = true;
                }
                if (Character.isDigit(c)) {
                    hasDigit = true;
                }
                if (hasLetter && hasDigit) {
                    return true;
                }
            }
            return false;
        }
        return false;
    }

    public static boolean isBirthDateValid(LocalDate birthdate) {
        if (birthdate != null) {
            if (birthdate.isAfter(LocalDate.now())) {
                return false;
            }

            Period age = Period.between(birthdate, LocalDate.now());
            if (age.getYears() < minimumAge) {
                return false;
            }
            return true;
        }
        return false;
    }

    public static boolean isEmailValid(String email) {
        return email != null && email.contains("@") && email.endsWith(".com");
    }
}
