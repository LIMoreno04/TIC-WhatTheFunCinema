package com.um.edu.uy.entities.DTOs;

import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CardDTO {
    @NotNull
    private String cardType;

    @NotNull
    private String holderName;

    @Id
    private String cardNumber;

    @NotNull
    private String expirationDate;

    private @NotNull String cvv;
}
