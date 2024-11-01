package com.um.edu.uy.repository;

import com.um.edu.uy.entities.plainEntities.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.lang.classfile.Opcode;
import java.util.Optional;

public interface GenreRepository extends JpaRepository<Genre,String> {

    Optional<Genre> findByGenreName(String genre);

}
