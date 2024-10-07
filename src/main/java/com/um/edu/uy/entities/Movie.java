package com.um.edu.uy.entities;

import com.um.edu.uy.enums.MovieGenre;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
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
