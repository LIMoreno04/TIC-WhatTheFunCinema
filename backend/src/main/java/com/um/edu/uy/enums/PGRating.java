package com.um.edu.uy.enums;

import lombok.Getter;

@Getter
public enum PGRating {
    E("E"),

    PG13("PG13"),

    PG18("PG18");

    private final String pgrating;

    PGRating(String pgrating) {
        this.pgrating = pgrating;
    }
}
