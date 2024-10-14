package com.um.edu.uy.entities;

import com.um.edu.uy.enums.ScreeningLanguage;
import com.um.edu.uy.exceptions.InvalidDataException;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Screening {

    @Id
    @ValidReleaseDate
    private LocalDateTime dateAndTime;

    @ManyToOne
    @JoinColumn(name = "roomNumber")
    private Room room;

    @NotNull
    @ManyToOne
    @JoinColumn(name = "movieId")
    private Movie movie;

    @NotNull
    private ScreeningLanguage language;

    @OneToMany(mappedBy = "screening", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Reservation> reservation;

    public Screening(LocalDateTime dateAndTime, Movie movie, boolean[][] reservedSeats, ScreeningLanguage language) {
        this.dateAndTime = dateAndTime;
        this.movie = movie;
        this.language = language;
    }

}
