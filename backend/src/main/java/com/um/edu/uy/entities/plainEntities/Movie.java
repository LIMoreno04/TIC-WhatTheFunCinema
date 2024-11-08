package com.um.edu.uy.entities.plainEntities;

import com.um.edu.uy.entities.validators.ValidReleaseDate;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
    @ManyToMany
    @JoinTable(name = "movies_genres")
    private List<Genre> genres;


    @NotNull
    @Lob
    private byte[] poster;

    @NotNull
    private String PGRating;

    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL)
    private List<Screening> screenings;

    @OneToMany(mappedBy = "movieId", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MovieCustomerRank> ratings;

}
