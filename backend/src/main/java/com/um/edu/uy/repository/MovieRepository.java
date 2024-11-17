package com.um.edu.uy.repository;

import com.um.edu.uy.entities.DTOs.MoviePreviewDTO;
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

    @Query("SELECT m.Id FROM Movie m " +
            "JOIN m.screenings s " +
            "WHERE s.date_and_time BETWEEN :previousWeek AND CURRENT_TIMESTAMP " +
            "OR s.date_and_time BETWEEN CURRENT_TIMESTAMP AND :nextWeek " +
            "GROUP BY m.Id " +
            "HAVING COUNT(CASE WHEN s.date_and_time BETWEEN :previousWeek AND CURRENT_TIMESTAMP THEN 1 END) > 0 " +
            "AND COUNT(CASE WHEN s.date_and_time BETWEEN CURRENT_TIMESTAMP AND :nextWeek THEN 1 END) > 0")
    Optional<List<Long>> findAllOnDisplay(LocalDateTime previousWeek, LocalDateTime nextWeek);





    @Query("SELECT DISTINCT m.Id FROM Movie m " +
            "JOIN m.screenings s " +
            "WHERE s.date_and_time > :currentTime " +
            "AND NOT EXISTS (" +
            "   SELECT 1 FROM Screening past WHERE past.movie = m " +
            "   AND past.date_and_time BETWEEN :previousWeek AND :currentTime" +
            ")")
    Optional<List<Long>> findAllComingSoon(LocalDateTime previousWeek, LocalDateTime currentTime);
    public Optional<List<Movie>> findByDirector(String director);

    public Optional<List<Movie>> findByPGRating(String pgrating);

    @Query("SELECT DISTINCT m.Id " +
            "FROM Movie m " +
            "JOIN m.screenings s " +
            "JOIN s.reservations r " +
            "WHERE r.customer.email = :customerEmail " +
            "AND s.date_and_time < CURRENT_TIMESTAMP")
    List<Long> findSeenMoviesByCustomerId(@Param("customerEmail") String email);



    @Query("SELECT new com.um.edu.uy.entities.DTOs.MoviePreviewDTO(m.title, m.poster, m.duration, m.PGRating, m.releaseDate) " +
            "FROM Movie m WHERE m.Id = :id")
    Optional<MoviePreviewDTO> getPreview(@Param("id") long id);


}
