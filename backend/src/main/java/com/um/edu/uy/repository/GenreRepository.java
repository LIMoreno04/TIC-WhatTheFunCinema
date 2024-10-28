package com.um.edu.uy.repository;

import com.um.edu.uy.entities.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenreRepository extends JpaRepository<Genre,String> {
}
