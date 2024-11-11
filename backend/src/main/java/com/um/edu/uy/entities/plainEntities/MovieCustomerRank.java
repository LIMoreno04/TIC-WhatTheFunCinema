package com.um.edu.uy.entities.plainEntities;

import com.um.edu.uy.entities.ids.CustomerRankID;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@IdClass(CustomerRankID.class)
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
