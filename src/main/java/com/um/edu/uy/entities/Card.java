package com.um.edu.uy.entities;

import com.um.edu.uy.enums.CardType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.YearMonth;

@Getter
@Setter
@AllArgsConstructor
@Builder
@Entity
public class Card {

    @NotNull
    private CardType cardType;

    @NotNull
    private String holderName;

    @Id
    private long cardNumber;

    @NotNull
    private YearMonth expirationDate;

    @NotNull
    private int cvv;

    //hay que validar el numero de tarjeta, el formato(como empieza)

}
