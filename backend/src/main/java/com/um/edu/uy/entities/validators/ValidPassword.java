package com.um.edu.uy.entities.validators;
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
    String message() default "La contraseña debe contener al menos 8 dígitos, una mayúscula, una minúscula y un símbolo.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}

