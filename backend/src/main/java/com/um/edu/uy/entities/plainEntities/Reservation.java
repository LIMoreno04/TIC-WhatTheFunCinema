package com.um.edu.uy.entities.plainEntities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.um.edu.uy.entities.ids.ReservationId;
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


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "email")
    @JsonBackReference
    private Customer customer;
}
