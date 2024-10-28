package com.um.edu.uy.repository;

import com.um.edu.uy.entities.Customer;
import com.um.edu.uy.entities.Reservation;
import com.um.edu.uy.entities.ReservationId;
import com.um.edu.uy.entities.ScreeningID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, ReservationId> {
    //public Reservation findById(Integer col, Integer row, ScreeningID screening);
}
