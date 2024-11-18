package com.um.edu.uy.entities.plainEntities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
    @JsonIgnore
    @JsonBackReference
    private Movie movieId;

    @Id
    @JsonIgnore
    @JsonBackReference
    @ManyToOne(fetch = FetchType.LAZY)
    private Customer customerEmail;

    @NotNull
    private int rank;
}
