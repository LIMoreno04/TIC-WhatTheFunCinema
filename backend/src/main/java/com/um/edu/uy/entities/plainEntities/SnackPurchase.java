package com.um.edu.uy.entities.plainEntities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.um.edu.uy.entities.ids.SnackPurchaseID;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@IdClass(SnackPurchaseID.class)
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SnackPurchase {

    @Id
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    private Customer customerEmail;

    @Id
    @JsonIgnore
    @ManyToOne
    private Snack snackId;

    @NotNull
    private int quantity;

    @NotNull
    private int purchasePrice;

    @NotNull
    private LocalDateTime purchaseDate;
}
