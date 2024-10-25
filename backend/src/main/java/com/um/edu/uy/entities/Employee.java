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
@NoArgsConstructor
@Entity
//@PrimaryKeyJoinColumn(name = "email")
public class Employee extends User {
    @NotNull
    private String address;

    @Builder(builderMethodName = "employeeBuilder")
    public Employee(String address, String email, String firstName, String lastName, LocalDate dateOfBirth, String celCountryCode, String celNumber, String idType, String idCountry, String idNumber, String password) {
        super(email, firstName, lastName, dateOfBirth, celCountryCode, celNumber, idType, idCountry, idNumber, password);
        this.address = address;
    }
}
