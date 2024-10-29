package com.um.edu.uy.repository;

import com.um.edu.uy.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, ReservationId> {
    Optional<Reservation> findByScreeningAndColAndRow(Screening screening, Integer col, Integer row);
}
