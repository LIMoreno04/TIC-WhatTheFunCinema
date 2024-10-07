package com.um.edu.uy.entities;

import com.um.edu.uy.enums.CountryCode;
import com.um.edu.uy.enums.IdDocumentType;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
@Getter
@Setter
@Builder
@Entity
public class Employee extends User{
    @NotNull
    private String address;

    public Employee(String address, String email, String firstName, String lastName, LocalDate dateOfBirth, CountryCode celCountryCode, long celNumber, IdDocumentType idType, CountryCode idCountry, long idNumber, String password) {
        super(email, firstName, lastName, dateOfBirth, celCountryCode, celNumber, idType, idCountry, idNumber, password);
        this.address = address;
    }
}
