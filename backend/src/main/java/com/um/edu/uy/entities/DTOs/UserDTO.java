package com.um.edu.uy.entities.DTOs;

import com.um.edu.uy.entities.validators.ValidBirthDate;
import com.um.edu.uy.entities.validators.ValidPassword;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;
@Data
public class UserDTO {
    @Email(message = "E-mail inválido.")
    protected String email;
    protected String firstName;
    protected String lastName;
    @ValidBirthDate
    protected LocalDate dateOfBirth;
    protected String celCountryCode;
    @Pattern(regexp = "^([0-9][1-9]\\d{0,13})| ([1-9]\\d{1,14})$", message = "Número de teléfono inválido.")
    protected String celNumber;
    protected String idType;
    protected String idCountry;
    protected String idNumber;
    @ValidPassword
    protected String password;


}