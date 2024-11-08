package com.um.edu.uy.entities.ids;

import lombok.*;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationId implements Serializable {
    private Integer row;
    private Integer col;
    private ScreeningID screening;
}
