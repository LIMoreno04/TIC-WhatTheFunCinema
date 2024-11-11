package com.um.edu.uy.entities.DTOs;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class CelNumberDTO {
    @Pattern(regexp = "^([0-9][1-9]\\d{0,13})| ([1-9]\\d{1,14})$", message = "Número de teléfono inválido.")
    private String celNumber;

    private String celCountryCode;
}
