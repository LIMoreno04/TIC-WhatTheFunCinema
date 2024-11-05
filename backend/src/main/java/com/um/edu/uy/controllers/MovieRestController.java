package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.DTOs.MovieDTO;
import com.um.edu.uy.entities.plainEntities.Genre;
import com.um.edu.uy.entities.plainEntities.Movie;
import com.um.edu.uy.enums.PGRating;
import com.um.edu.uy.services.GenreService;
import com.um.edu.uy.services.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("api/movies")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MovieRestController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private GenreService genreService;

    @PostMapping("/addMovie")
    public ResponseEntity<?> addMovie(@RequestBody MovieDTO movieDTO) throws IOException {
        Map<String, String> errors = new HashMap<>();

        if (movieService.findByExactTitle(movieDTO.getTitle()) != null) {
            errors.put("title", "Ya existe una película con ese título y fecha de lanzamiento.");
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        try {
            LocalTime.parse(movieDTO.getDuration());
        } catch (Exception e) {
            errors.put("duration", "Formato de duración inválido. Use el formato HH:mm:ss.");
        }

        if (!Pattern.matches("^(G|PG|PG-13|R|NC-17)$", movieDTO.getPGRating())) {
            errors.put("PGRating", "Calificación de película inválida. Use: G, PG, PG-13, R o NC-17.");
        }

        if (!errors.isEmpty()) {
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        List<Genre> genres = movieDTO.getGenres().stream()
                .map(genreService::findByGenreName)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

        LocalTime duration = LocalTime.parse(movieDTO.getDuration());
        LocalDate releaseDate = LocalDate.parse(movieDTO.getReleaseDate());
        byte[] poster = movieDTO.getPoster().getBytes();

        Movie newMovie = movieService.addMovie(
                movieDTO.getTitle(),
                duration,
                movieDTO.getDescription(),
                releaseDate,
                movieDTO.getDirector(),
                genres,
                movieDTO.getCurrentlyOnDisplay(),
                poster,
                movieDTO.getPGRating()
        );

        return ResponseEntity.ok(newMovie);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Movie>> allMovies() {
        List<Movie> allMovies = movieService.getAllMovies();

        if (allMovies.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(allMovies);
        }
    }

    @GetMapping("/allOnDisplay")
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

    @GetMapping("/director")
    public ResponseEntity<List<Movie>> showMoviesByDirector(@RequestBody String director) {
        List<Movie> moviesByDirector = movieService.getByDirector(director);

        if (moviesByDirector.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(moviesByDirector);
        }
    }

    @GetMapping("/genre")
    public ResponseEntity<List<Movie>> showMoviesByGenre(@RequestBody List<String> stringGenres) {
        List<Genre> genres = stringGenres.stream()
                .map(genreName -> genreService.findByGenreName(genreName))
                .collect(Collectors.toList());

        List<Movie> moviesByGenre = movieService.getByGenre(genres);

        if (moviesByGenre.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(moviesByGenre);
        }
    }

    @GetMapping("/pgrating")
    public ResponseEntity<List<Movie>> showByPGRating(@RequestBody String pgrating) {
        String realPgrating = PGRating.valueOf(pgrating).getPgrating();

        List<Movie> moviesByPGRating = movieService.getByPGRating(realPgrating);

        if(moviesByPGRating.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(moviesByPGRating);
        }
    }

    @PostMapping("/deleteMovie")
    public ResponseEntity<Movie> deleteMovie(@RequestBody String title) {
        Movie movie = movieService.findByExactTitle(title);

        if (movie == null) {
            return ResponseEntity.notFound().build();
        } else {
            movieService.deleteMovie(movie);
            return ResponseEntity.ok(movie);
        }
    }

}
