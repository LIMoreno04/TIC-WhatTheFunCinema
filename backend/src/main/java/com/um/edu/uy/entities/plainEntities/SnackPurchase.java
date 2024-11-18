package com.um.edu.uy.entities.plainEntities;

import com.um.edu.uy.entities.ids.SnackPurchaseID;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@IdClass(SnackPurchaseID.class)
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SnackPurchase {

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    private Customer customerEmail;

    @Id
    @ManyToOne
    private Snack snackId;

    @NotNull
    private int quantity;

    @NotNull
    private int purchasePrice;
}
