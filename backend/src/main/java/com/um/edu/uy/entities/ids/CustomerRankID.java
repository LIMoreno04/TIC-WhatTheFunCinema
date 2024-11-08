package com.um.edu.uy.entities.ids;

import jakarta.persistence.IdClass;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerRankID implements Serializable {
    private String customerEmail;
    private long movieId;
}
