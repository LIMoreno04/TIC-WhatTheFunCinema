package com.um.edu.uy.services;

import com.um.edu.uy.entities.DTOs.MoviePreviewDTO;
import com.um.edu.uy.entities.plainEntities.Genre;
import com.um.edu.uy.entities.plainEntities.Movie;
import com.um.edu.uy.entities.plainEntities.MovieCustomerRank;
import com.um.edu.uy.exceptions.InvalidDataException;
import com.um.edu.uy.repository.GenreRepository;
import com.um.edu.uy.repository.MovieCustomerRankRepository;
import com.um.edu.uy.repository.MovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
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

    @Autowired
    private MovieCustomerRankRepository movieCustomerRankRepo;

    public Optional<List<Object[]>> getTitlesAndIds() {
        return movieRepo.getTitlesAndIds();
    }
    public Movie addMovie(String title,
                          LocalTime duration,
                          String description,
                          LocalDate releaseDate,
                          String director,
                          List<Genre> genres,
                          byte[] poster,
                          String PGRating) {


        Movie movie = Movie.builder()
                .title(title)
                .duration(duration)
                .description(description)
                .releaseDate(releaseDate)
                .director(director)
                .genres(genres)
                .poster(poster)
                .PGRating(PGRating)
                .build();

        return movieRepo.save(movie);
    }
    public Movie findById(Long id) throws InvalidDataException {
        return movieRepo.findById(id).orElseThrow(()->new InvalidDataException("Movie not found"));
    }

    @Transactional
    public MoviePreviewDTO getPreview(long id) throws InvalidDataException {
        return movieRepo.getPreview(id).orElseThrow(()->new InvalidDataException("Movie not found"));
    }


    public List<Movie> getAllMovies() {
        return movieRepo.findAll();
    }

    public List<Movie> findByTitle(String title) {
        return movieRepo.findByTitleContainingIgnoreCase(title).orElse(new LinkedList<>());
    }

    public void deleteMovie(Movie movie) {
        movieRepo.delete(movie);
    }

    public List<Long> findAllMoviesOnDisplay() {
        return movieRepo.findAllOnDisplay(LocalDateTime.now().minusWeeks(1), LocalDateTime.now().plusWeeks(1)).orElse(new LinkedList<>());
    }

    public List<Long> findAllMoviesComingSoon() {
        return movieRepo.findAllComingSoon(LocalDateTime.now().minusWeeks(1), LocalDateTime.now()).orElse(new LinkedList<>());
    }

    public List<Movie> getByGenre(List<Genre> genres) {
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

        return foundMovies;
    }

    public List<Movie> getByDirector(String director) {
        return movieRepo.findByDirector(director).orElse(new LinkedList<>());
    }

    public List<Movie> getByPGRating(String pgrating) {
        return movieRepo.findByPGRating(pgrating).orElse(new LinkedList<>());
    }

    public Duration getDurationByID(long id) throws InvalidDataException{
        LocalTime durationTime = movieRepo.getDurationById(id).orElseThrow(() -> new InvalidDataException("Movie not found."));
        return Duration.ofHours(durationTime.getHour()).plusMinutes(durationTime.getMinute()).plusSeconds(durationTime.getSecond());
    }

    public List<Long> findSeenMoviesByCustomerId(String email) {
        return movieRepo.findSeenMoviesByCustomerId(email);
    }

    public List<Long> getMovieRanking() throws InvalidDataException {
        return movieCustomerRankRepo.findBestRankedMovies();
    }
}
