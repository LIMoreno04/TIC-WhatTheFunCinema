package com.um.edu.uy.entities.ids;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SnackPurchaseID implements Serializable {
    String customerEmail;
    long snackId;
}
