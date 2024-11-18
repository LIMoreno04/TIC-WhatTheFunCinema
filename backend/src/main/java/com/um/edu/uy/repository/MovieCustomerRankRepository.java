package com.um.edu.uy.repository;

import com.um.edu.uy.entities.DTOs.MovieRankingDTO;
import com.um.edu.uy.entities.ids.CustomerRankID;
import com.um.edu.uy.entities.plainEntities.Movie;
import com.um.edu.uy.entities.plainEntities.MovieCustomerRank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MovieCustomerRankRepository extends JpaRepository<MovieCustomerRank, CustomerRankID> {


    @Query("SELECT new com.um.edu.uy.entities.DTOs.MovieRankingDTO(m.movieId.Id, m.movieId.title, m.movieId.poster, m.movieId.PGRating, AVG(m.rank)) " +
            "FROM MovieCustomerRank m " +
            "GROUP BY m.movieId " +
            "ORDER BY AVG(m.rank) DESC")
    List<MovieRankingDTO> findBestRankedMovies();

    @Query("SELECT AVG(m.rank) " +
            "FROM MovieCustomerRank m " +
            "WHERE m.movieId.Id = :movieId")
    Optional<Double> findAverageRankByMovieId(@Param("movieId") Long movieId);

}
