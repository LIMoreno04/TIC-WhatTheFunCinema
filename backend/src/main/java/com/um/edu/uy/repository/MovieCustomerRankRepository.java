package com.um.edu.uy.repository;

import com.um.edu.uy.entities.ids.CustomerRankID;
import com.um.edu.uy.entities.plainEntities.Movie;
import com.um.edu.uy.entities.plainEntities.MovieCustomerRank;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MovieCustomerRankRepository extends JpaRepository<MovieCustomerRank, CustomerRankID> {

    @Query("SELECT m.movieId " +
            "FROM MovieCustomerRank m " +
            "GROUP BY m.movieId " +
            "ORDER BY AVG(m.rank) DESC")
    List<Long> findBestRankedMovies();
}
