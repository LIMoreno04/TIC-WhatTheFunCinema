package com.um.edu.uy.entities.plainEntities;

import com.um.edu.uy.entities.validators.ValidBirthDate;
import com.um.edu.uy.entities.validators.ValidPassword;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "web_user")
public class User {

    @NotNull
    @Id
    @Email
    protected String email;

    @NotNull
    protected String firstName;

    @NotNull
    protected String lastName;

    @NotNull
    @ValidBirthDate
    protected LocalDate dateOfBirth;

    @NotNull
    protected String celCountryCode;

    @NotNull
    protected String celNumber;

    @NotNull
    protected String idType;

    @NotNull
    protected String idCountry;

    @NotNull
    protected String idNumber;

    @NotNull
    @ValidPassword
    protected String password;
}
