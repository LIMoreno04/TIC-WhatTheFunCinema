package com.um.edu.uy.enums;

import lombok.Getter;

@Getter
public enum PGRating {
    G("G"),

    PG("PG"),

    PG13("PG13"),

    R("R"),

    NC17("NC17");

    private final String pgrating;

    PGRating(String pgrating) {
        this.pgrating = pgrating;
    }
}
