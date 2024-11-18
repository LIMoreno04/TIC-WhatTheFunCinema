package com.um.edu.uy.entities.plainEntities;


import jakarta.persistence.*;
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

    @Lob
    private byte[] snackPicture;
}
