package com.um.edu.uy.enums;

import lombok.Getter;

@Getter
public enum CardType {
    Credit("Credit"),
    Debit("Debit");

    private final String type;
    CardType(String type) {
        this.type = type;
    }
}
