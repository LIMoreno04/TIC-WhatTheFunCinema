package com.um.edu.uy.repository;

import com.um.edu.uy.entities.Screening;
import com.um.edu.uy.entities.ScreeningID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScreeningRepository extends JpaRepository<Screening, ScreeningID> {
}
