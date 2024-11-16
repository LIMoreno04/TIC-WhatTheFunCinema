package com.um.edu.uy.repository;

import com.um.edu.uy.entities.plainEntities.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface MovieRepository extends JpaRepository<Movie, Long> {

    public Optional<Movie> findByTitle(String title);

    public Optional<List<Movie>> findByTitleContainingIgnoreCase(String title);

    @Query("SELECT m.Id, m.title FROM Movie m ")
    Optional<List<Object[]>> getTitlesAndIds();

    @Query("SELECT m.duration FROM Movie m WHERE m.Id =:id")
    Optional<LocalTime> getDurationById(@Param("id")long id);

    @Query("SELECT m.Id, m.poster, m.title, m.PGRating FROM Movie m " +
            "JOIN m.screenings s " +
            "WHERE s.date_and_time < :nextWeek " +
            "AND s.date_and_time > :previousWeek")
    Optional<List<Object[]>> findAllOnDisplay(LocalDateTime previousWeek, LocalDateTime nextWeek);

    @Query("SELECT m.Id, m.poster, m.title, m.PGRating FROM Movie m " +
            "JOIN m.screenings s " +
            "WHERE s.date_and_time > :currentTime " +
            "AND NOT EXISTS (" +
            "   SELECT 1 FROM Screening past WHERE past.movie = m " +
            "   AND past.date_and_time BETWEEN :previousWeek AND :currentTime" +
            ")")
    Optional<List<Object[]>> findAllComingSoon(LocalDateTime previousWeek, LocalDateTime currentTime);
    public Optional<List<Movie>> findByDirector(String director);

    public Optional<List<Movie>> findByPGRating(String pgrating);
}
