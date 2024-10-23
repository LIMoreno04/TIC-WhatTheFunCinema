package com.um.edu.uy.entities;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Id;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ReservationId implements Serializable {
    private Integer row;
    private Integer col;
    private ScreeningID screening;
}
