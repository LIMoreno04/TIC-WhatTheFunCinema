package com.um.edu.uy.repository;

import com.um.edu.uy.entities.DTOs.MovieRankingDTO;
import com.um.edu.uy.entities.ids.CustomerRankID;
import com.um.edu.uy.entities.plainEntities.Movie;
import com.um.edu.uy.entities.plainEntities.MovieCustomerRank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MovieCustomerRankRepository extends JpaRepository<MovieCustomerRank, CustomerRankID> {


    @Query("SELECT new com.um.edu.uy.entities.DTOs.MovieRankingDTO(m.movieId, m.title, m.poster, m.PGRating, AVG(m.rank)) " +
            "FROM MovieCustomerRank m " +
            "GROUP BY m.movieId " +
            "ORDER BY AVG(m.rank) DESC")
    List<MovieRankingDTO> findBestRankedMovies();
}
