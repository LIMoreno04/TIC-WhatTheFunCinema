package com.um.edu.uy.entities.DTOs;

import com.um.edu.uy.entities.validators.ValidBirthDate;
import lombok.Data;

import java.time.LocalDate;

@Data
public class BirthdateDTO {
    @ValidBirthDate
    private LocalDate dateOfBirth;
}
