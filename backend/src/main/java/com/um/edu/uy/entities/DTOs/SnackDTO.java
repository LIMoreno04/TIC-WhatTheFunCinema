package com.um.edu.uy.entities.DTOs;

import lombok.Data;

@Data
public class SnackDTO {

    private long snackId;
    private String snackName;
    private int price;
    private String snackDescription;
    private String snackPicture;
}
