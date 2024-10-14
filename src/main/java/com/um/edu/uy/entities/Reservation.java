package com.um.edu.uy.entities;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Reservation {
    @EmbeddedId
    private ReservationId reservationId;
    @ManyToOne
    @JoinColumn(name = "dateAndTime")
    private Screening screening;
    @ManyToOne
    @JoinColumn(name = "email")
    private Customer customer;
}
