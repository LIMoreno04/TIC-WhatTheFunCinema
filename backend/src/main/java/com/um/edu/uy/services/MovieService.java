package com.um.edu.uy.services;

import com.um.edu.uy.entities.Genre;
import com.um.edu.uy.entities.Movie;
import com.um.edu.uy.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepo;

    public Movie addMovie(String title, LocalTime duration, String description, LocalDate releaseDate, String director, List<Genre> genres) {
        Movie movie = Movie.builder()
                .title(title)
                .duration(duration)
                .description(description)
                .releaseDate(releaseDate)
                .director(director)
                .genres(genres)
                .build();
        return movieRepo.save(movie);
    }

    public void deleteMovie(String title) {
        Optional<Movie> result = movieRepo.findByTitle(title);
        movieRepo.delete(result.get());
    }
}
