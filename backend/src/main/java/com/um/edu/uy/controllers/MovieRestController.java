package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.DTOs.MovieDTO;
import com.um.edu.uy.entities.plainEntities.Genre;
import com.um.edu.uy.entities.plainEntities.Movie;
import com.um.edu.uy.enums.PGRating;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.services.GenreService;
import com.um.edu.uy.services.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/movies")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MovieRestController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private GenreService genreService;


    @PostMapping(value = "/addMovie", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addMovie(
            @RequestParam("title") String title,
            @RequestParam("duration") String duration,
            @RequestParam("description") String description,
            @RequestParam("releaseDate") String releaseDate,
            @RequestParam("director") String director,
            @RequestParam("genres") List<String> genres,
            @RequestParam("PGRating") String PGRating,
            @RequestParam("poster") MultipartFile poster) {

        Map<String, String> errors = new HashMap<>();

        // Duration validation
        try {
            LocalTime.parse(duration);
        } catch (Exception e) {
            errors.put("duration", "Formato de duración inválido. Use el formato HH:mm:ss.");
        }

        // PG Rating validation
        if (!Pattern.matches("^(G|PG|PG-13|R|NC-17)$", PGRating)) {
            errors.put("PGRating", "Calificación de película inválida. Use: G, PG, PG-13, R, o NC-17.");
        }

        // Return validation errors if any
        if (!errors.isEmpty()) {
            return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
        }

        // Genre handling
        List<Genre> genreList = new LinkedList<>();
        for (String genreName : genres) {
            genreList.add(genreService.findByGenreNameElseAdd(genreName));
        }

        // Parse other fields
        LocalTime parsedDuration = LocalTime.parse(duration);
        LocalDate parsedReleaseDate = LocalDate.parse(releaseDate);

        // Convert MultipartFile to byte array
        byte[] posterBytes;
        try {
            posterBytes = poster.getBytes();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error reading file.");
        }

        // Create and save the movie
        Movie newMovie = movieService.addMovie(
                title,
                parsedDuration,
                description,
                parsedReleaseDate,
                director,
                genreList,
                posterBytes,
                PGRating
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
        List<Movie> moviesOnDisplay = movieService.findAllMoviesOnDisplay();

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
                .map(genreName -> {
                    try {
                        return genreService.findByGenreName(genreName);
                    } catch (InvalidDataException e) {
                        throw new RuntimeException(e);
                    }
                })
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

    @DeleteMapping("/deleteMovie")
    public ResponseEntity<Movie> deleteMovie(@RequestBody Movie movie) {
        if (movie == null) {
            return ResponseEntity.notFound().build();
        } else {
            movieService.deleteMovie(movie);
            return ResponseEntity.ok(movie);
        }
    }

}
