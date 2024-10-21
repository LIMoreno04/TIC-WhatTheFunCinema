package com.um.edu.uy.entities;

import com.um.edu.uy.enums.CardType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.YearMonth;
import java.util.List;

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

    @NotNull
    @ManyToMany(mappedBy = "paymentMethods",cascade = CascadeType.ALL)
    private List<Customer> customerList;
}
