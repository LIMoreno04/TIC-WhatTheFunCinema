package com.um.edu.uy.entities.plainEntities;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class HomePageMovies {

    @Id
    @OneToOne
    @JoinColumn(name = "id", nullable = false, unique = true)
    private Movie movieId;

    public HomePageMovies(Movie movieId) {
        this.movieId = movieId;
    }
}
