package com.um.edu.uy.entities;

import com.um.edu.uy.enums.CardType;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.YearMonth;

@Getter
@Setter
@AllArgsConstructor
@Builder
@Entity
public class Card {

    private CardType cardType;

    private String holderName;


    private long cardNumber;

    private YearMonth expirationDate;

    private int cvv;

    //hay que validar el numero de tarjeta, el formato(como empieza)

}
