package com.um.edu.uy.entities.ids;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerSnackID implements Serializable {
    String customerEmail;
    long snackId;
}
