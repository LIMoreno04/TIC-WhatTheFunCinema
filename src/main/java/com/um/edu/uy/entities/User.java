package com.um.edu.uy.entities;

import com.um.edu.uy.enums.CountryCode;
import com.um.edu.uy.enums.IdDocumentType;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@Builder
@Entity
public class User {
    @NotNull
    private String email;

    @NotNull
    private String firstName;

    @NotNull
    private  String lastName;

    @NotNull
    @ValidBirthDate
    private LocalDate dateOfBirth;

    @NotNull
    private CountryCode celCountryCode;

    @NotNull
    private long celNumber;

    @NotNull
    private IdDocumentType idType;

    @NotNull
    private CountryCode idCountry;

    @NotNull
    private long idNumber;

    @NotNull
    @ValidPassword
    private String password;
}
