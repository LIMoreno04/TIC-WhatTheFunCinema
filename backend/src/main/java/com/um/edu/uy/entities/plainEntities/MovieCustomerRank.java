package com.um.edu.uy.entities.plainEntities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;

public class MovieCustomerRank {

    @ManyToOne
    @JoinColumn(name = "movie_id", nullable = false)
    private int movieId;

    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private String customerEmail;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int rank;
}
