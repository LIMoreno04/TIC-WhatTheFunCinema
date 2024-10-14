package com.um.edu.uy.entities;

import jakarta.persistence.Embeddable;

import java.io.Serializable;
import java.time.LocalDateTime;

@Embeddable
public class ReservationId implements Serializable {
    private Integer row;
    private Integer column;
    private LocalDateTime dateAndTime;
}
