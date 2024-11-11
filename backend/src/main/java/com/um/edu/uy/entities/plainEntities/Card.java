package com.um.edu.uy.entities.plainEntities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
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

    private @NotNull String cvv;

    @NotNull
    @JsonIgnore
    @ManyToMany(mappedBy = "paymentMethods",cascade = CascadeType.ALL,fetch = FetchType.EAGER)
    private List<Customer> customerList;
}
