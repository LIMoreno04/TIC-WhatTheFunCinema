package com.um.edu.uy.repository;

import com.um.edu.uy.entities.plainEntities.Snack;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SnackRepository extends JpaRepository<Snack, Long> {
    Optional<Snack> findById(long snackId);
    Optional<Snack> findBySnackName(String name);
    Optional<List<Snack>> findBySnackNameContainingIgnoreCase(String name);
    Optional<List<Snack>> findByPriceLessThanEqual(int price);
}
