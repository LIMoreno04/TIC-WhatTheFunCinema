package com.um.edu.uy.entities.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class SnackDTO {

    private long snackId;
    private String snackName;
    private int price;
}
