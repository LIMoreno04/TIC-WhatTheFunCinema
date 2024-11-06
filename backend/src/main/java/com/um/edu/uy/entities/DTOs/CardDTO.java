package com.um.edu.uy.entities.DTOs;

import com.um.edu.uy.enums.CardType;
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

    @NotNull
    private int cvv;
}
