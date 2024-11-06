package com.um.edu.uy.entities.plainEntities;

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
@NoArgsConstructor
@Builder
@Entity
public class Card {

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

    @NotNull
    @ManyToMany(mappedBy = "paymentMethods",cascade = CascadeType.ALL)
    private List<Customer> customerList;
}
