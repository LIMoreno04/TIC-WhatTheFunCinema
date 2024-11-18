package com.um.edu.uy.entities.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FullSnackDTO {
    //No se ni que estoy haciendo con mi vida a este punto.
    private long id;
    private String name;
    private byte[] image;
    private int price;
    private String description;
}
