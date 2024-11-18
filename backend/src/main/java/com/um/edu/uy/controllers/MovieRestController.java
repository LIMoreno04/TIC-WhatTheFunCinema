package com.um.edu.uy.controllers;

import com.um.edu.uy.entities.DTOs.MovieDTO;
import com.um.edu.uy.entities.DTOs.MoviePreviewDTO;
import com.um.edu.uy.entities.DTOs.MovieRankingDTO;
import com.um.edu.uy.entities.DTOs.MovieRevenueDTO;
import com.um.edu.uy.entities.plainEntities.Genre;
import com.um.edu.uy.entities.plainEntities.Movie;
import com.um.edu.uy.entities.plainEntities.Theatre;
import com.um.edu.uy.enums.PGRating;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.services.GenreService;
import com.um.edu.uy.services.MovieService;
import jakarta.servlet.http.HttpSession;
import org.jetbrains.annotations.NotNull;
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
import java.lang.reflect.Array;
import java.time.Duration;
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


    @GetMapping("/allTitles")
    public ResponseEntity<List<Object[]>> getAllTitles() {
    return ResponseEntity.ok(movieService.getTitlesAndIds().orElse(new LinkedList<>()));
    }

    @PostMapping(value = "/addMovie", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addMovie( HttpSession session,
            @RequestParam("title") String title,
            @RequestParam("duration") String duration,
            @RequestParam("description") String description,
            @RequestParam("releaseDate") String releaseDate,
            @RequestParam("director") String director,
            @RequestParam("genres") List<String> genres,
            @RequestParam("PGRating") String PGRating,
            @RequestParam("poster") MultipartFile poster) {
        if (session.getAttribute("role") !=null && session.getAttribute("role").equals("employee")) {

            Map<String, String> errors = new HashMap<>();


            // Genre handling
            List<Genre> genreList = new LinkedList<>();
            for (String genreName : genres) {
                if(genreName.isEmpty() || genreName.isBlank()) {
                    errors.put("genres","Género no puede ser vacío.");
                }
                genreList.add(genreService.findByGenreNameElseAdd(genreName));
            }

            // PG Rating validation
            if (!Pattern.matches("^(G|PG|PG-13|R|NC-17)$", PGRating)) {
                errors.put("PGRating", "Calificación de película inválida. Use: G, PG, PG-13, R, o NC-17.");
            }

            // Parse other fields
            LocalTime parsedDuration = LocalTime.parse(duration);
            LocalDate parsedReleaseDate = LocalDate.parse(releaseDate);

            // Convert MultipartFile to byte array
            byte[] posterBytes;
            try {
                posterBytes = poster.getBytes();
            } catch (IOException e) {
                errors.put("poster", "Error leyendo el archivo.");
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
            }

            // Return validation errors if any
            if (!errors.isEmpty()) {
                return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
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

            return ResponseEntity.ok(new HashMap<>().put("ok","Película agregada."));
        } else { return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Sin permisos."); }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMovieById(@PathVariable Long id) {
        try {
            Movie movie = movieService.findById(id);

            // Encode the byte array to a Base64 string
            String posterBase64 = Base64.getEncoder().encodeToString(movie.getPoster());
            MovieDTO movieDTO = getMovieDTO(movie, posterBase64);

            return ResponseEntity.ok(movieDTO);

        } catch (InvalidDataException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Película con id "+id+" no encontrada.");
        }

    }

    @GetMapping("/screenings/{movieId}")
    public ResponseEntity<?> getScreeningsByTheatre(@PathVariable long movieId) {
        return ResponseEntity.ok(movieService.findScreenings(movieId));
    }

    @GetMapping("/preview/{id}")
    public ResponseEntity<?> getMoviePreview(@PathVariable Long id) {
        try {
            MoviePreviewDTO moviePreview = movieService.getPreview(id);
            String posterBase64 = Base64.getEncoder().encodeToString((byte[]) moviePreview.getPoster());
            HashMap<String,String> movie = new HashMap<>();
            movie.put("id",""+moviePreview.getId());
            movie.put("title",moviePreview.getTitle());
            movie.put("poster","data:image/jpeg;base64,"+ posterBase64);
            movie.put("duration",moviePreview.getDuration().toString());
            movie.put("PGRating",moviePreview.getPGRating());
            movie.put("releaseDate",moviePreview.getReleaseDate().toString());
            return ResponseEntity.ok(movie);
        } catch (InvalidDataException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new HashMap<String,String>().put("movieId","Película con id "+id+" no encontrada."));
        }

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

    @GetMapping("/allGenres")
    public ResponseEntity<List<String>> allGenres() {
        return ResponseEntity.ok(genreService.findAllGetNames());
    }

    @GetMapping("/allOnDisplay")
    public ResponseEntity<?> showAllMoviesOnDisplay() {
        List<Long> moviesOnDisplay = movieService.findAllMoviesOnDisplay();

        if (moviesOnDisplay.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(moviesOnDisplay);
        }
    }
    @GetMapping("/allOnDisplayWithTitles")
    public ResponseEntity<?> showAllMoviesOnDisplayWithTitles() {
        List<Object[]> moviesOnDisplay = movieService.findAllMoviesOnDisplayWithTitles();
        List<HashMap<String,Object>> movies = new LinkedList<>();
        for (Object[] movie : moviesOnDisplay) {
            HashMap<String,Object> moviee = new HashMap<>();
            moviee.put("movieId",movie[0]);
            moviee.put("movieTitle",movie[1]);
            movies.add(moviee);
        }
        if (moviesOnDisplay.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(movies);
        }
    }

    @GetMapping("/allComingSoon")
    public ResponseEntity<?> showAllMoviesComingSoon() {
        List<Long> moviesComingSoon = movieService.findAllMoviesComingSoon();

        if (moviesComingSoon.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(moviesComingSoon);
        }
    }

    @GetMapping("/allTheRest")
    public ResponseEntity<?> showAllOtherMovies() {
        List<Long> otherMovies = movieService.findAllOtherMovies();

        if (otherMovies.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(otherMovies);
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

    @GetMapping("/genreFilter/{stringGenres}")
    public ResponseEntity<List<Long>> showMoviesByGenre(@PathVariable List<String> stringGenres) {
        List<Genre> genres = stringGenres.stream()
                .map(genreName -> {
                    try {
                        return genreService.findByGenreName(genreName);
                    } catch (InvalidDataException e) {
                        throw new RuntimeException(e);
                    }
                })
                .collect(Collectors.toList());

        List<Long> moviesByGenre = movieService.getByGenre(genres);

        if (moviesByGenre.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(moviesByGenre);
        }
    }

    @GetMapping("/pgratingFilter/{pgrating}")
    public ResponseEntity<List<MoviePreviewDTO>> showByPGRating(@PathVariable String pgrating) {
        String realPgrating = PGRating.valueOf(pgrating).getPgrating();

        List<MoviePreviewDTO> moviesByPGRating = movieService.getByPGRating(realPgrating);

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

    @GetMapping("/ranking")
    public ResponseEntity<?> ranking() throws InvalidDataException {
        List<MovieRankingDTO> ranking = movieService.getMovieRanking();

        if (ranking.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(ranking);
        }
    }

    @GetMapping("/highestRevenue")
    public ResponseEntity<?> highestRevenue() {
        List<MovieRevenueDTO> highestRevenue = movieService.getHighestRevenue();

        if (highestRevenue.isEmpty()) {
            return ResponseEntity.notFound().build();
        } else {
            return ResponseEntity.ok(highestRevenue);
        }
    }






























    @NotNull
    private static MovieDTO getMovieDTO(Movie movie, String posterBase64) {
        List<String> genres = new LinkedList<>();
        for (Genre genre: movie.getGenres()) {
            genres.add(genre.getGenreName());
        }
        // Create a DTO or populate fields with Base64 encoded image
        MovieDTO movieDTO = new MovieDTO(movie.getId(), movie.getTitle(), movie.getDuration().toString(), movie.getDescription(), movie.getReleaseDate().toString(), movie.getDirector(), genres,"data:image/jpeg;base64,"+ posterBase64, movie.getPGRating());
        movieDTO.setId(movie.getId());
        movieDTO.setTitle(movie.getTitle());
        movieDTO.setPoster("data:image/jpeg;base64," + posterBase64); // Prefix with data URI scheme
        return movieDTO;
    }




























}
