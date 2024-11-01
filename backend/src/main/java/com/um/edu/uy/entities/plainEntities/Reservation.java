package com.um.edu.uy.entities.plainEntities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@IdClass(ReservationId.class)
@Entity
public class Reservation {

    @Id
    private Integer col;

    @Id
    private Integer row;

    @ManyToOne
    @Id
    @JoinColumns({
            @JoinColumn(name = "dateAndTime", referencedColumnName = "date_and_time"),
            @JoinColumn(name = "room_number", referencedColumnName = "room_number"),
            @JoinColumn(name = "theatre", referencedColumnName = "theatre")
    })
    private Screening screening;


    @ManyToOne
    @JoinColumn(name = "email")
    private Customer customer;
}
