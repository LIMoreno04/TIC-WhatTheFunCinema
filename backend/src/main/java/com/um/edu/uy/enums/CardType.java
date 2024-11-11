package com.um.edu.uy.enums;

import lombok.Getter;

@Getter
public enum CardType {
    VCredit("Visa credito"),
    VDebit("Visa debito"),
    MCredit("Mastercard credito"),
    MDebit("Mastercard debito"),
    AMCredit("AmEx credito"),
    AMDebit("AmEx debito");

    private final String type;
    CardType(String type) {
        this.type = type;
    }
}
