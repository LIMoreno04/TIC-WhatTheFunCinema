package com.um.edu.uy.repository;

import com.um.edu.uy.entities.Customer;
import com.um.edu.uy.entities.Reservation;
import com.um.edu.uy.entities.ReservationId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, ReservationId> {
}
