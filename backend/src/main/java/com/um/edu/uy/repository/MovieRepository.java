package com.um.edu.uy.repository;

import com.um.edu.uy.entities.plainEntities.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    public Optional<Movie> findByTitle(String title);

    public Optional<List<Movie>> findByTitleContainingIgnoreCase(String title);

    public Optional<List<Movie>> findByCurrentlyOnDisplayTrue();

    public Optional<List<Movie>> findByDirector(String director);

    public Optional<List<Movie>> findByPGRating(String pgrating);
}
