package com.um.edu.uy.repository;

import com.um.edu.uy.entities.DTOs.MoviePreviewDTO;
import com.um.edu.uy.entities.DTOs.SnackPreviewDTO;
import com.um.edu.uy.entities.plainEntities.Snack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SnackRepository extends JpaRepository<Snack, Long> {
    Optional<Snack> findBySnackName(String name);
    Optional<List<Snack>> findBySnackNameContainingIgnoreCase(String name);
    Optional<List<Snack>> findByPriceLessThanEqual(int price);

    @Query("SELECT new com.um.edu.uy.entities.DTOs.SnackPreviewDTO(s.snackName, s.snackPicture, s.price) " +
            "FROM Snack s WHERE s.snackId = :id")
    Optional<SnackPreviewDTO> getPreview(@Param("id") long id);

}
