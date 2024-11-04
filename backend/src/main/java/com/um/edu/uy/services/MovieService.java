package com.um.edu.uy.services;

import com.um.edu.uy.entities.plainEntities.Genre;
import com.um.edu.uy.entities.plainEntities.Movie;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.GenreRepository;
import com.um.edu.uy.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
@Service
public class MovieService {

    @Autowired
    private MovieRepository movieRepo;

    @Autowired
    private GenreRepository genreRepo;

    public Movie addMovie(String title,
                          LocalTime duration,
                          String description,
                          LocalDate releaseDate,
                          String director,
                          List<Genre> genres,
                          Boolean currentlyOnDisplay,
                          byte[] poster) {


        Movie movie = Movie.builder()
                .title(title)
                .duration(duration)
                .description(description)
                .releaseDate(releaseDate)
                .director(director)
                .genres(genres)
                .currentlyOnDisplay(currentlyOnDisplay)
                .poster(poster)
                .build();

        return movieRepo.save(movie);
    }

    public List<Movie> getAllMovies() {
        return movieRepo.findAll();
    }

    public Movie findByExactTitle(String title) throws InvalidDataException {
        Optional<Movie> result = movieRepo.findByTitle(title);

        if (result.isPresent()) {
            return result.get();
        } else {
            throw new InvalidDataException("No movies found.");
        }
    }

    public List<Movie> findByTitle(String title) throws InvalidDataException {
        Optional<List<Movie>> result = movieRepo.findByTitleContainingIgnoreCase(title);

        if (result.isPresent()) {
            return result.get();
        }else {
            throw new InvalidDataException("No movies found.");
        }
    }
    public void deleteMovie(String title) {
        Optional<Movie> result = movieRepo.findByTitle(title);
        movieRepo.delete(result.get());
    }

    public List<Movie> showMovieDisplay() throws InvalidDataException {
        Optional<List<Movie>> result = movieRepo.findByCurrentlyOnDisplayTrue();

        if (result.isPresent()) {
            return result.get();
        } else {
            throw new InvalidDataException("No movies on display.");
        }

    }

    public List<Movie> getByGenre(List<Genre> genres) throws InvalidDataException {
        List<Movie> foundMovies = getAllMovies();

        for (int i = 0; i < foundMovies.size(); i++) {
            Movie movie = foundMovies.get(i);
            List<Genre> movieGenres = movie.getGenres();
            for (int j = 0; j < genres.size(); j++) {
                Genre genre = genres.get(j);
                if (!movieGenres.contains(genre)) {
                    foundMovies.remove(movie);
                }
            }
        }

        if (!foundMovies.isEmpty()) {
            return foundMovies;
        } else {
            throw new InvalidDataException("No movies found.");
        }
    }

    public List<Movie> getByDirector(String direcor) throws InvalidDataException {
        Optional<List<Movie>> result = movieRepo.findByDirector(direcor);

        if (result.isPresent()) {
            return result.get();
        } else {
            throw new InvalidDataException("No movies found.");
        }
    }

    public List<Movie> getByPGRating(String pgrating) throws InvalidDataException {
        Optional<List<Movie>> result = movieRepo.findByPGRating(pgrating);

        if (result.isPresent()) {
            return result.get();
        } else {
            throw new InvalidDataException("No movies found.");
        }
    }

}
