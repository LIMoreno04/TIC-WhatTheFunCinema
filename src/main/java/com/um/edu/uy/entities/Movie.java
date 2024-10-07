package com.um.edu.uy.entities;

import com.um.edu.uy.enums.MovieGenre;
import jakarta.persistence.*;
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

    private String title;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long Id;

    private LocalTime duration;

    @Column(name = "descr")
    private String description;

    private LocalDate releaseDate;

    private String director;

    private List<MovieGenre> genres;


}
