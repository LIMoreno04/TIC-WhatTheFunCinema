package com.um.edu.uy.entities.plainEntities;

import com.um.edu.uy.entities.ids.CustomerRankID;
import com.um.edu.uy.entities.ids.CustomerSnackID;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@IdClass(CustomerSnackID.class)
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomerSnack {

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
