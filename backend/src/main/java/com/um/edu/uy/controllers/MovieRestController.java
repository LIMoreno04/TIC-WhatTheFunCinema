package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.DTOs.MovieDTO;
import com.um.edu.uy.entities.plainEntities.Genre;
import com.um.edu.uy.entities.plainEntities.Movie;
import com.um.edu.uy.enums.PGRating;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.services.GenreService;
import com.um.edu.uy.services.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
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
    public ResponseEntity<Movie> addMovie(@RequestBody MovieDTO movieDTO) throws IOException {

        LocalTime duration = LocalTime.parse(movieDTO.getDuration());
        LocalDate releaseDate = LocalDate.parse(movieDTO.getReleaseDate());
        byte[] poster = movieDTO.getPoster().getBytes();

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
                poster
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
    public ResponseEntity<List<Movie>> showAllMoviesOnDisplay() throws InvalidDataException {
        List<Movie> moviesOnDisplay = movieService.showMovieDisplay();

        if (moviesOnDisplay.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(moviesOnDisplay);
        }
    }

    @GetMapping("/title")
    public ResponseEntity<List<Movie>> showMoviesByTitle(@RequestBody String title) throws InvalidDataException {
        List<Movie> moviesByTitle = movieService.findByTitle(title);

        if (moviesByTitle.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(moviesByTitle);
        }
    }

    @GetMapping("/director")
    public ResponseEntity<List<Movie>> showMoviesByDirector(@RequestBody String director) throws InvalidDataException {
        List<Movie> moviesByDirector = movieService.getByDirector(director);

        if (moviesByDirector.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(moviesByDirector);
        }
    }

    @GetMapping("/genre")
    public ResponseEntity<List<Movie>> showMoviesByGenre(@RequestBody List<String> stringGenres) throws InvalidDataException {
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
    public ResponseEntity<List<Movie>> showByPGRating(@RequestBody String pgrating) throws InvalidDataException {
        String realPgrating = PGRating.valueOf(pgrating).getPgrating();

        List<Movie> moviesByPGRating = movieService.getByPGRating(realPgrating);

        if(moviesByPGRating.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(moviesByPGRating);
        }
    }

}
