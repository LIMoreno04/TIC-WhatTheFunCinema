package com.um.edu.uy.repository;

import com.um.edu.uy.entities.plainEntities.Snack;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SnackRepository extends JpaRepository<Snack, Long> {

    public Optional<Snack> findById (long snackId);
}
