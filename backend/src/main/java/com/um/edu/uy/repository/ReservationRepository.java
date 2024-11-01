package com.um.edu.uy.repository;

import com.um.edu.uy.entities.plainEntities.Reservation;
import com.um.edu.uy.entities.plainEntities.ReservationId;
import com.um.edu.uy.entities.plainEntities.Screening;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, ReservationId> {
    Optional<Reservation> findByScreeningAndColAndRow(Screening screening, Integer col, Integer row);
    List<Reservation> findAllByScreening(Screening screening);
}
