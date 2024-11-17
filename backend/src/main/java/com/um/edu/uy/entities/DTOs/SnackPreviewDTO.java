package com.um.edu.uy.entities.DTOs;


import lombok.Data;

@Data
public class SnackPreviewDTO {
    private String snackName;
    private byte[] picture;
    private int price;

    public SnackPreviewDTO(String snackName, byte[] picture, int price) {
        this.snackName = snackName;
        this.picture = picture;
        this.price = price;
    }
}
