package com.um.edu.uy.enums;

public enum IdDocumentType {
    CI("CI"),
    Pasaporte("Pasaporte");
private String type;

    IdDocumentType(String type) {
        this.type = type;
    }

    public String getType() {
        return type;
    }
}
