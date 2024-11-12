package com.um.edu.uy.repository;

import com.um.edu.uy.entities.plainEntities.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface GenreRepository extends JpaRepository<Genre,String> {

    Optional<Genre> findByGenreName(String genre);

    @Query("SELECT g.genreName FROM Genre g")
    List<String> findAllGetNames();
}
