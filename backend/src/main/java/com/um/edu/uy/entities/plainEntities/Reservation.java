package com.um.edu.uy.entities.plainEntities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.um.edu.uy.entities.ids.ReservationIdD;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.cglib.core.Local;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@IdClass(ReservationIdD.class)
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
    @JsonIgnore
    private Customer customer;

    @NotNull
    private LocalDateTime purchaseDate;
}
