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
    private String email;
    private String firstName;
    private String lastName;
    @ValidBirthDate
    private LocalDate dateOfBirth;
    private String celCountryCode;
    @Pattern(regexp = "^([0-9][1-9]\\d{0,13})| ([1-9]\\d{1,14})$", message = "Número de teléfono inválido.")
    private String celNumber;
    private String idType;
    private String idCountry;
    private String idNumber;
    @ValidPassword
    private String password;


}