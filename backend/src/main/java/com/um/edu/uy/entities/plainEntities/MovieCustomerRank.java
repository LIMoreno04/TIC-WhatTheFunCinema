package com.um.edu.uy.entities.plainEntities;

import com.um.edu.uy.entities.ids.CustomerRankID;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Entity
@IdClass(CustomerRankID.class)
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MovieCustomerRank {

    @Id
    @ManyToOne
    private Movie movieId;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    private Customer customerEmail;

    @NotNull
    private int rank;
}
