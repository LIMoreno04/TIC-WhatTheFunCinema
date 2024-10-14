package com.um.edu.uy.entities;

import com.um.edu.uy.enums.MovieGenre;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
public class Movie {

    @NotNull
    private String title;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long Id;

    @NotNull
    private LocalTime duration;

    @NotNull
    @Column(name = "descr")
    private String description;

    @NotNull
    @ValidReleaseDate
    private LocalDate releaseDate;

    @NotNull
    private String director;

    @NotNull
    private List<MovieGenre> genres;


}
