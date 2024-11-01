package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.DTOs.MovieDTO;
import com.um.edu.uy.entities.plainEntities.Genre;
import com.um.edu.uy.entities.plainEntities.Movie;
import com.um.edu.uy.services.GenreService;
import com.um.edu.uy.services.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/movies")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")

public class MovieRestController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private GenreService genreService;

    @PostMapping("/addMovie")
    public ResponseEntity<Movie> addMovie(@RequestBody MovieDTO movieDTO) {

        LocalTime duration = LocalTime.parse(movieDTO.getDuration());
        LocalDate releaseDate = LocalDate.parse(movieDTO.getReleaseDate());

        List<Genre> genres = movieDTO.getGenres().stream()
                .map(genreName -> genreService.findByGenreName(genreName))
                .collect(Collectors.toList());

        Movie newMovie = movieService.addMovie(
                movieDTO.getTitle(),
                duration,
                movieDTO.getDescription(),
                releaseDate,
                movieDTO.getDirector(),
                genres,
                movieDTO.getCurrentlyOnDisplay(),
                movieDTO.getPoster()
        );

        return ResponseEntity.ok(newMovie);

    }


    @GetMapping("/allMovies")
    public ResponseEntity<List<Movie>> allMovies() {
        List<Movie> allMovies = movieService.getAllMovies();

        if (allMovies.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(allMovies);
        }
    }

    @GetMapping("/allMoviesOnDisplay")
    public ResponseEntity<List<Movie>> showAllMoviesOnDisplay() {
        List<Movie> moviesOnDisplay = movieService.showMovieDisplay();

        if (moviesOnDisplay.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(moviesOnDisplay);
        }
    }

    @GetMapping("/title")
    public ResponseEntity<List<Movie>> showMoviesByTitle(@RequestBody String title) {
        List<Movie> moviesByTitle = movieService.findByTitle(title);

        if (moviesByTitle.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(moviesByTitle);
        }
    }

}
