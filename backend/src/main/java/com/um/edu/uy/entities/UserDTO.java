package com.um.edu.uy.entities;

import lombok.Data;

import java.time.LocalDate;
@Data
public class UserDTO {
    private String email;
    private String firstName;
    private String lastName;
    private String dateOfBirth;
    private String celCountryCode;
    private String celNumber;
    private String idType;
    private String idCountry;
    private String idNumber;
    private String password;


}