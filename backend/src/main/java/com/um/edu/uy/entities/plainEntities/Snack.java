package com.um.edu.uy.entities.plainEntities;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Snack {

    @NotNull
    private String snackName;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long snackId;

    @NotNull
    private int price;

    @NotNull
    private String snackDescription;
}
