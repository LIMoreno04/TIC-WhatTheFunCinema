package com.um.edu.uy.repository;

import com.um.edu.uy.entities.plainEntities.Theatre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface TheatreRepository extends JpaRepository<Theatre,String> {
    @Query("SELECT t.location FROM Theatre t")
    List<String> findAllLocations();

    public Optional<Theatre> findByLocationIgnoreCase(String location);
}
