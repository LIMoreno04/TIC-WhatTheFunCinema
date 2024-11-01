package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.Movie;
import com.um.edu.uy.services.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/movies")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")

public class MovieRestController {

    @Autowired
    private MovieService movieService;

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
